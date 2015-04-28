///<reference path="../state/server-state.ts"/>
///<reference path="..\replication\replicator-server.ts"/>
interface RelevanceSet extends ServerState{
    remove(e:any):void;
}