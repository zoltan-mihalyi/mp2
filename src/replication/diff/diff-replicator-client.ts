///<reference path="..\replicator-client.ts"/>
///<reference path="diff.ts"/>
import ClientStateContainer=require('../client-state-container');

class DiffReplicatorClient extends ClientStateContainer<any> implements ReplicatorClient<Diff> {
    public onUpdate(message:Diff) { //todo
        for (var i = 0; i < message.create.length; i++) {
            var newObject = message.create[i];
            this.state[newObject.id] = newObject;
        }
        for (var i = 0; i < message.remove.length; i++) {
            delete this.state[message.remove[i]];
        }
        for (var i = 0; i < message.modify.length; i++) {
            var mod = message.modify[i];
            this.state[mod.id] = mod;
        }
    }
}

export = DiffReplicatorClient;