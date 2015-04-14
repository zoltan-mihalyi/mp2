///<reference path="replicator.ts"/>
import replicators=require('../replication/replicators');

interface BruteForceMessage {
}

class BruteForceReplicator implements Replicator<BruteForceMessage> {
    private state:GameState;

    constructor(state:GameState) {
        this.state = state;
    }

    public update():Message<BruteForceMessage>[] {
        return [{ //TODO use array
            reliable: false,
            keepOrder: true,
            data: this.state
        }];
    }

    public onUpdate(newState:BruteForceMessage):void {
        for (var i in newState) {
            if (newState.hasOwnProperty(i)) {
                this.state[i] = newState[i];
            }
        }
    }
}

replicators['brute-force'] = function (s:string) {
    return new BruteForceReplicator(s);
};