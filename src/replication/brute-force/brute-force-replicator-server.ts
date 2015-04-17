///<reference path="../replicator-server.ts"/>
///<reference path="brute-force-message.ts"/>

import StateContainer=require('../state-container');

class BruteForceReplicatorClient extends StateContainer implements ReplicatorServer<BruteForceMessage> {
    typeId:number = 0;

    public update():Message<BruteForceMessage>[] {
        var entities = [];
        this.state.forEach(function (entity) {
            entities.push(entity);
        });
        if (entities.length === 0) {
            return [];
        }
        return [{ //TODO use array
            reliable: false,
            keepOrder: true,
            data: entities
        }];
    }
}

export = BruteForceReplicatorClient;