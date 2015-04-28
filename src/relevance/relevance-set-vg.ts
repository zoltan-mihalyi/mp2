///<reference path="relevance-set.ts"/>
///<reference path="..\state\real-server-state.ts"/>

import IdSetImpl=require('../id-set-impl');
import ArrayMap = require('../array-map');
import ArraySet = require('../array-set');

interface VisibilityGroup<T> {
    add(entity:T):void;
    remove(entity:T):void;
    removeEntities(filter:(e:T)=>boolean):void;
}

class RelevanceSetVg implements RelevanceSet {
    private elements:ArrayMap<any,number> = new ArrayMap<any, number>();
    private visibilityGroups:VisibilityGroup<any>[] = [];
    private state:RealServerState;

    constructor(state:RealServerState) {
        this.state = state;
    }

    remove(e:any):void {
        if (!this.contains(e)) {
            return;
        }
        for (var i = 0; i < this.visibilityGroups.length; i++) {
            this.visibilityGroups[i].remove(e);
        }
    }

    forEach(callback:(item:IDProvider)=>void):void {
        this.elements.forEach((element:any)=> {
            callback(this.state.transform(element));
        });
    }

    contains(e:any):boolean {
        return this.elements.contains(e);
    }

    public createVisibilityGroup<V extends IDProvider>():VisibilityGroup<V> {
        var vg = new VisibilityGroupImpl<V>(this);
        this.visibilityGroups.push(vg);
        return vg;
    }

    public elementAdded(e:any):void {
        if (this.elements.contains(e)) {
            this.elements.put(e, this.elements.get(e) + 1);
        } else {
            this.elements.put(e, 1);
        }
    }

    public elementRemoved(e:any):void {
        var num:number = this.elements.get(e);
        if (num === 1) {
            this.elements.remove(e);
        } else {
            this.elements.put(e, num - 1);
        }
    }
}

class VisibilityGroupImpl<T> implements VisibilityGroup<T> {
    private relevanceSet:RelevanceSetVg;
    private visible:ArraySet<T> = new ArraySet<T>();

    constructor(relevanceSet:RelevanceSetVg) {
        this.relevanceSet = relevanceSet;
    }

    public add(e:T):void {
        var relevanceSet = this.relevanceSet;
        if (this.visible.add(e)) {
            relevanceSet.elementAdded(e);
        }
    }

    public remove(e:T):void {
        if (this.visible.remove(e)) {
            this.relevanceSet.elementRemoved(e)
        }
    }

    public removeEntities(filter:(e:T)=>boolean):void {
        var toRemove = [];
        this.visible.forEach((entity:T)=> {
            if (filter.call(entity, entity)) {
                toRemove.push(entity);
            }
        });
        for (var i = 0; i < toRemove.length; i++) {
            this.remove(toRemove[i]);
        }
    }
}

export = RelevanceSetVg;