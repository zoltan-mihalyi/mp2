///<reference path="..\server-state.ts"/>
///<reference path="..\..\id-set.ts"/>
///<reference path=".\entity.ts"/>
///<reference path="writable-server-state.ts"/>
import IdSetImpl=require('../../id-set-impl');
import EntityImpl=require('./entity-impl');

class ServerStateImpl implements WritableServerState {
    private entities:IdSet<Entity> = new IdSetImpl<Entity>();
    private nextId:number = 0;

    public forEach(callback:(e:Entity)=>void):void {
        this.entities.forEach(function (e:Entity) {
            return e;
        });
    }

    public createEntity():Entity {
        var entity = new EntityImpl({
            id: ++this.nextId,
            attrs: {},
            links: {}
        }, this.entities);
        this.entities.put(entity);
        return entity;
    }
}

export =ServerStateImpl;