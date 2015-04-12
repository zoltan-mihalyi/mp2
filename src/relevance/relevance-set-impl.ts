///<reference path="..\game\game-state.ts"/>
///<reference path="relevance-set.ts"/>
///<reference path="visibility-group.ts"/>

import VisibilityGroupImpl=require('./visibility-group-impl');
import IdSetImpl=require('../id-set-impl');
import RealStateImpl=require('../game/real-state-impl');

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

class RelevanceSetImpl extends RealStateImpl implements RelevanceSet {
    visible:IdSet<Entity> = new IdSetImpl<Entity>();
    toHide:IdSet<Entity> = new IdSetImpl<Entity>();
    toShow:IdSet<Entity> = new IdSetImpl<Entity>();
    visibleNum:EntityMapImpl = new EntityMapImpl();


    constructor(gameState:GameState) {
        super();
    }

    createVisibilityGroup() {
        return new VisibilityGroupImpl(this); //TODO
    }

    on(ev, callback) {
        //TODO
    }
}
export = RelevanceSetImpl;