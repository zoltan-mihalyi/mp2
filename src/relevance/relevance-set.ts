///<reference path="../state/server-replication-state.ts"/>
///<reference path="..\replication\replicator-server.ts"/>
interface RelevanceSet extends ServerReplicationState{
    remove(e:any):void;
}