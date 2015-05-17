///<reference path="../replicator-client.ts"/>
///<reference path="brute-force-message.ts"/>
///<reference path="..\..\state\client-state.ts"/>

import StateContainer=require('../state-container');

class BruteForceReplicatorClient implements ReplicatorClient<BruteForceMessage> { //todo factory
    public onUpdate(entities:BruteForceMessage, batch:ReplicationClientStateBatch):void { //todo pass batch as parameter
        var byId:{[index:number]:IdProvider} = {};
        for (var i = 0; i < entities.length; i++) {
            var e = entities[i];
            byId[e.id] = e;
        }

        batch.forEach(function (e:IdProvider) {
            if (!byId[e.id]) {
                batch.remove(e.id);
            }
        });

        for (var i = 0; i < entities.length; i++) {
            batch.merge(entities[i]);
        }
    }
}

export = BruteForceReplicatorClient;