///<reference path="replicator-server.ts"/>
///<reference path="../state/server-replication-state.ts"/>
interface ReplicatorServerFactory{
    new (s:ServerReplicationState):ReplicatorServer<any>;
}