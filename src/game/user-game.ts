///<reference path="..\user.ts"/>
///<reference path="..\replication\replicator-server.ts"/>
///<reference path="..\relevance\relevance-set.ts"/>
///<reference path="../state/server-state.ts"/>
///<reference path="replication-state.ts"/>
interface UserGame extends IdProvider {
    leave():void;
    user:User;
    onLeave:Function;
    addCommand(name:string, callback:Function):void;
    setRelevanceSet(relevanceSet:RelevanceSet):void;
    getRelevanceSet():RelevanceSet;
    getReplicator():ReplicatorServer<any>;
    getRealState():ServerState;
    getClientGame():ClientGame;
    lastCommandIndex:number;
    getLastExecuted():number;
    onCommand(command:string, params:any[], index:number, elapsed:number):void;
    onSync(index:number, elapsed:number):void;
    replicationState:ReplicationState;
    enableSync():void;
}