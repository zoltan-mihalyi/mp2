///<reference path="game-state.ts"/>
import EntityImpl=require('./entity-impl');
import RealStateImpl=require('./real-state-impl');
class GameStateImpl extends RealStateImpl {
    //private IdSetImpl<Entity> entities=new IdSetImpl<Entity>();

    createEntity():Entity {
        var entity = new EntityImpl('d');
        this.onAdd(entity);
        return entity; //TODO
    }

    removeEntity(entity:Entity):void {
        this.onRemove(entity);
    }
}

export = GameStateImpl;