///<reference path="user-game.ts"/>
interface ClientUserGame extends UserGame { //todo remove
    setReplicator(replicator:ReplicatorClient<any>):void
    getReplicator():ReplicatorClient<any>;
    runCallback(id:number, params:any[]):void;
}