///<reference path="..\replicator-client.ts"/>
///<reference path="diff.ts"/>

class DiffReplicatorClient implements ReplicatorClient<Diff> {
    public onUpdate(message:Diff, batch:ReplicationClientStateBatch) { //todo
        for (var i = 0; i < message.create.length; i++) {
            var newObject = message.create[i];
            batch.merge(newObject);
        }
        for (var i = 0; i < message.remove.length; i++) {
            batch.remove(message.remove[i]);
        }
        for (var i = 0; i < message.modify.length; i++) {
            batch.merge(message.modify[i]);
        }
    }
}

export = DiffReplicatorClient;