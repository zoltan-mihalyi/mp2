///<reference path="..\client-state.ts"/>
import EntityImpl=require('./entity-impl');
import IdSetImpl=require('../../id-set-impl');

class ClientStateImpl implements ClientState { //todo move more common part to client.ts
    private entities:IdSet<Entity> = new IdSetImpl<Entity>();
    public onCreate:(e:Entity)=>void = ()=> {
    };
    public onRemove:(e:Entity)=>void = ()=> {
    };

    get(id:number):Entity {
        return this.entities.getIndex(id);
    }

    createBatch():ClientStateBatch {
        var created:Entity[] = [];
        var toUpdate:EntityData[] = [];

        return {
            state: this,
            remove: (id:number):void => {
                this.entities.removeIndex(id);
            },
            create: (data:EntityData):void => {
                var entity = new EntityImpl(data, this.entities);
                this.entities.put(entity);
                created.push(entity);
            },
            update: (data:EntityData):void=> {
                toUpdate.push(data);
            },
            apply: ()=> {
                for (var i = 0; i < toUpdate.length; i++) {
                    this.entities.get(toUpdate[i]).merge(toUpdate[i]);
                }
                for (var i = 0; i < created.length; i++) {
                    this.onCreate(created[i]);
                }
            }
        }
    }

    forEach(callback:(e:IdProvider)=>void):void {
        this.entities.forEach(callback);
    }
}

export = ClientStateImpl