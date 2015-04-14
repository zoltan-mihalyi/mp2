///<reference path="../replicator-client.ts"/>
///<reference path="brute-force-message.ts"/>

import StateContainer=require('../state-container');

class BruteForceReplicatorClient extends StateContainer implements ReplicatorClient<BruteForceMessage> {
    public onUpdate(newState:BruteForceMessage):void {
        for (var i in newState) {
            if (newState.hasOwnProperty(i)) {
                this.state[i] = newState[i];
            }
        }
    }
}

export = BruteForceReplicatorClient;