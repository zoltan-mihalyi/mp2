///<reference path="user-game.ts"/>
///<reference path="..\replication\replicator-client.ts"/>
interface ClientUserGame extends UserGame {
    setReplicator(replicatorClient:ReplicatorClient<any>);
}