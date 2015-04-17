///<reference path="..\game\game-state.ts"/>
///<reference path="relevance-set.ts"/>
///<reference path="visibility-group.ts"/>

import VisibilityGroupImpl=require('./visibility-group-impl');
import IdSetImpl=require('../id-set-impl');
import GameStateImpl=require('../game/game-state-impl');

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

class RelevanceSetImpl extends GameStateImpl implements RelevanceSet {
    visible:IdSet<Entity> = new IdSetImpl<Entity>();
    toHide:IdSet<Entity> = new IdSetImpl<Entity>();
    toShow:IdSet<Entity> = new IdSetImpl<Entity>();
    visibleNum:EntityMap<number> = new EntityMapImpl();
    private gameState:GameState;

    setState(gameState:GameState) {
        this.gameState = gameState;
    }

    createVisibilityGroup() {
        return new VisibilityGroupImpl(this); //TODO
    }

    on(ev, callback) {
        //TODO
    }
}
export = RelevanceSetImpl;