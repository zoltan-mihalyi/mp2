///<reference path="..\user.ts"/>
///<reference path="..\replication\replicator-server.ts"/>
///<reference path="..\relevance\relevance-set.ts"/>
///<reference path="..\state\real-server-state.ts"/>
interface ServerUserGame extends IDProvider{
    leave():void;
    user:User;
    onLeave:Function;
    addCommand(name:string, callback:Function):void;
    setRelevanceSet(relevanceSet:RelevanceSet):void;
    getRelevanceSet():RelevanceSet;
    getReplicator():ReplicatorServer<any>;
    getRealState():RealServerState;
    getClientGame():ClientGame;
}