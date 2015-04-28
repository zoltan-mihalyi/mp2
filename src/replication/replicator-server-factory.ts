///<reference path="replicator-server.ts"/>
///<reference path="..\state\server-state.ts"/>
interface ReplicatorServerFactory{
    new (s:ServerState):ReplicatorServer<any>;
}