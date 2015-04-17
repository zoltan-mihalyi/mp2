///<reference path="entity.ts"/>
///<reference path="game-state.ts"/>

import EntityImpl=require('./entity-impl');
import IdSetImpl=require('../id-set-impl');
import BruteForceReplicatorServer= require('../replication/brute-force/brute-force-replicator-server');

class GameStateImpl implements GameState {
    public id:number = 0;
    private replicator:ReplicatorServer<any>;
    private _entities:IdSetImpl<Entity> = new IdSetImpl<Entity>();

    public onAdd:(e:Entity)=>void = function () {
    };
    public onRemove:(e:Entity)=>void = function () {
    };

    constructor() {
        this.setReplicator(new BruteForceReplicatorServer());
    }

    createEntity():Entity {
        var entity = new EntityImpl(1);
        this._entities.put(entity);
        this.onAdd(entity);
        return entity; //TODO
    }

    removeEntity(entity:Entity):void {
        this.onRemove(entity);
    }

    forEach(callback:(p1:Entity)=>void):void {
        this._entities.forEach(callback);
    }

    setReplicator(replicator:ReplicatorServer<any>) {
        this.replicator = replicator;
        replicator.setState(this);
    }

    getReplicator():ReplicatorServer<any> {
        return this.replicator;
    }
}

export = GameStateImpl;