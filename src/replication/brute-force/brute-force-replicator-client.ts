///<reference path="../replicator-client.ts"/>
///<reference path="brute-force-message.ts"/>

import StateContainer=require('../state-container');
import EntityImpl=require('../../game/entity-impl');

class BruteForceReplicatorClient implements ReplicatorClient<BruteForceMessage> { //todo factory
    private state:ClientState; //todo move to common

    public onUpdate(entities:BruteForceMessage):void {
        this.state.forEach((entity:Entity)=> { //delete old
            if (!entities[entity.id]) {
                this.state.remove(entity);
            }
        });
        for (var i in entities) {
            this.state.merge(entities[i]);
        }
    }

    public setState(state:ClientState):void {
        this.state = state;
    }
}

export = BruteForceReplicatorClient;