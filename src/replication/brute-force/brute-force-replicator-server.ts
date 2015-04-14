///<reference path="../replicator-server.ts"/>
///<reference path="brute-force-message.ts"/>

import StateContainer=require('../state-container');

class BruteForceReplicatorClient extends StateContainer implements ReplicatorServer<BruteForceMessage> {
    typeId:number = 0;

    public update():Message<BruteForceMessage>[] {
        return [{ //TODO use array
            reliable: false,
            keepOrder: true,
            data: this.state
        }];
    }
}

export = BruteForceReplicatorClient;