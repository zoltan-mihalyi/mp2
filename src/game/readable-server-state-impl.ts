///<reference path="server-state.ts"/>
import IdSetImpl=require('../id-set-impl');
import BruteForceReplicatorServer= require('../replication/brute-force/brute-force-replicator-server');
import StateImpl = require('./state-impl');

class ReadableServerStateImpl extends StateImpl implements ReadableServerGameState {
    public id:number = Math.random(); //TODO
    private replicator:ReplicatorServer<any>;
    public entities:IdSet<Entity> = new IdSetImpl<Entity>();

    constructor() {
        super();
        this.setReplicator(new BruteForceReplicatorServer());
    }

    public forEach(callback:(e:Entity)=>void):void {
        this.entities.forEach(callback);
    }

    contains(entity:Entity):boolean {
        return this.entities.contains(entity);
    }

    public getReplicator():ReplicatorServer<any> {
        return this.replicator;
    }

    setReplicator(replicator:ReplicatorServer<any>) {
        this.replicator = replicator;
        replicator.setState(this);
    }
}

export = ReadableServerStateImpl;