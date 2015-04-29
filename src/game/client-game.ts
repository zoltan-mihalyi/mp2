///<reference path="..\state\client-state.ts"/>
///<reference path="..\replication\replicator-client.ts"/>
interface ClientGame extends IDProvider{
    getInfo():any;
    execute(command:string, ...params:any[]);
    setState(state:ClientState);
    getState():ClientState;
    getReplicator():ReplicatorClient<any>;
    setReplicator(replicator:ReplicatorClient<any>);
    getSimulatedData(entity:any):any;
    setPredicted(command:string, handler:Function):void;
    setSimulated(entity:any, simulationData:any):void;
}