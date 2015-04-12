///<reference path="replicator-server.ts"/>
///<reference path="replicator-client.ts"/>
import StateContainer = require('./state-container');

interface BruteForceMessage {
}

class BruteForceReplicatorServer extends StateContainer implements ReplicatorServer<BruteForceMessage> {
    public update() {
        return [{ //TODO use array
            reliable: false,
            keepOrder: true,
            data: this.state
        }];
    }
}

class BruteForceReplicatorClient extends StateContainer implements ReplicatorClient<BruteForceMessage> {
    public onUpdate(newState:BruteForceMessage) {
        for (var i in newState) {
            if (newState.hasOwnProperty(i)) {
                this.state[i] = newState[i];
            }
        }
    }
}


var exp = {
    Server: BruteForceReplicatorServer,
    Client: BruteForceReplicatorClient
};

export = exp;