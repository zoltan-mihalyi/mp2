///<reference path="../replicator-client.ts"/>
///<reference path="brute-force-message.ts"/>

import StateContainer=require('../state-container');
import EntityImpl=require('../../game/entity-impl');

class BruteForceReplicatorClient extends StateContainer implements ReplicatorClient<BruteForceMessage> {
    public onUpdate(newState:BruteForceMessage):void {
        this.state.forEach((e:Entity)=> {
            this.state.removeEntity(e);
        });
        for (var i = 0; i < newState.length; i++) {
            var newEntity = newState[i];
            var entity = new EntityImpl(newEntity.id);
            for (var j in  newEntity) {
                if (j !== 'id') {
                    entity[j] = newEntity[j];
                }
            }
            this.state.addEntity(entity);
        }
    }
}

export = BruteForceReplicatorClient;