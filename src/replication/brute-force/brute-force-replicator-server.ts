///<reference path="../replicator-server.ts"/>
///<reference path="brute-force-message.ts"/>

import StateContainer=require('../state-container');

class BruteForceReplicatorServer extends StateContainer implements ReplicatorServer<BruteForceMessage> {
    typeId:number = 0;

    public update():Message<BruteForceMessage>[] {
        var entities:BruteForceMessage = [];
        var num = 0;
        this.state.forEach((entity:IdProvider)=> {
            entities.push(entity);
            num++;
        });
        if (num === 0) {
            return [];
        }
        return [{ //TODO use array
            reliable: false,
            keepOrder: true,
            data: entities
        }];
    }

    public firstUpdate():Message<BruteForceMessage>[] {
        return this.update();
    }
}

export = BruteForceReplicatorServer;