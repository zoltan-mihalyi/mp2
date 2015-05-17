///<reference path="..\..\id-set.ts"/>
///<reference path=".\entity.ts"/>
///<reference path="..\server-state.ts"/>
import IdSetImpl=require('../../id-set-impl');
import EntityImpl=require('./entity-impl');

class ServerStateImpl implements ServerState {
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

    public transform(entity:Entity):IdProvider {
        return entity;
    }

    public onRemove(instance:Entity):void {
        this.entities.remove(instance);
    }
}

export =ServerStateImpl;