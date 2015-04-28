///<reference path="replicator-client.ts"/>
///<reference path="..\state\client-state.ts"/>
interface ReplicatorClientFactory{
    (s:ClientState):ReplicatorClient<any>;
}