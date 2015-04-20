///<reference path="../replicator-client.ts"/>
///<reference path="brute-force-message.ts"/>

import StateContainer=require('../state-container');
import EntityImpl=require('../../game/entity-impl');

class BruteForceReplicatorClient implements ReplicatorClient<BruteForceMessage> { //todo factory
    private state:ClientState; //todo move to common

    public onUpdate(entities:BruteForceMessage):void {
        var batch=this.state.createBatch();
        this.state.forEach((entity:Entity)=> { //delete old
            if (!entities[entity.id]) {
                batch.remove(entity);
            }
        });
        for (var i in entities) {
            batch.merge(entities[i]);
        }
        batch.apply();
    }

    public setState(state:ClientState):void {
        this.state = state;
    }
}

export = BruteForceReplicatorClient;