///<reference path="../state/server-state.ts"/>
///<reference path="visibility-group.ts"/>
///<reference path="relevance-set-vg.ts"/>

import IdSetImpl=require('../id-set-impl');
import ArrayMap = require('../array-map');
import ArraySet = require('../array-set');

interface RelevanceSetVgInner extends RelevanceSetVg{
    elementAdded(e:any):void;
    elementRemoved(e:any):void;
}

class RelevanceSetVgImpl implements RelevanceSetVg {
    private elements:ArrayMap<any,number> = new ArrayMap<any, number>();
    private visibilityGroups:VisibilityGroup<any>[] = [];
    private state:ServerState;

    constructor(state:ServerState) {
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

    forEach(callback:(item:IdProvider)=>void):void {
        this.elements.forEach((element:any)=> {
            callback(this.state.transform(element));
        });
    }

    contains(e:any):boolean {
        return this.elements.contains(e);
    }

    public createVisibilityGroup<T>():VisibilityGroup<T> {
        var vg = new VisibilityGroupImpl<T>(this);
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
    private relevanceSet:RelevanceSetVgInner;
    private visible:ArraySet<T> = new ArraySet<T>();

    constructor(relevanceSet:RelevanceSetVgInner) {
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

export = RelevanceSetVgImpl;