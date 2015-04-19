///<reference path="../game/server-state.ts"/>
///<reference path="relevance-set.ts"/>
///<reference path="visibility-group.ts"/>

import VisibilityGroupImpl=require('./visibility-group-impl'); //todo move together
import IdSetImpl=require('../id-set-impl');
import ReadableServerStateImpl=require('../game/readable-server-state-impl');

class EntityMapImpl implements EntityMap<number> {
[index:number]:number
    set(e:Entity, value:number) {
        this[e.id] = value;
    }

    remove(e:Entity) {
        delete this[e.id];
    }

    increment(e:Entity):number {
        return ++this[e.id];
    }

    decrement(e:Entity):number {
        return --this[e.id];
    }
}

class RelevanceSetImpl extends ReadableServerStateImpl implements RelevanceSet { //todo közös részeket gamestateimpl-el gamestatereadebleimpl-be!
    toHide:IdSet<Entity> = new IdSetImpl<Entity>();
    toShow:IdSet<Entity> = new IdSetImpl<Entity>();
    visibleNum:EntityMap<number> = new EntityMapImpl();
    private gameState:ServerGameState;
    private visibilityGroups:VisibilityGroup[] = [];

    public setState(gameState:ServerGameState):void {
        if (this.gameState) {
            throw new Error('state already set');
        }
        this.gameState = gameState;
    }

    public getState():ServerGameState {
        return this.gameState;
    }

    public createVisibilityGroup():VisibilityGroup {
        var vg = new VisibilityGroupImpl(this);
        this.visibilityGroups.push(vg);
        return vg; //TODO
    }

    public removeEntity(entity:Entity):void {
        for (var i = 0; i < this.visibilityGroups.length; i++) {
            this.visibilityGroups[i].remove(entity);
        }
    }
}
export = RelevanceSetImpl;