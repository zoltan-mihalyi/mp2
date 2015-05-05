///<reference path="..\state\client-state.ts"/>
///<reference path="..\replication\replicator-client.ts"/>

interface CommandListener {
    onCommand(command:string, params:any[], index:number, elapsed:number);
    onSync(index:number, elapsed:number);
}

interface ClientGame extends IDProvider,CommandListener {
    getInfo():any;
    execute(command:string, ...params:any[]);
    executeSimulation(fn:Function):void;
    setState(state:ClientState);
    getState():ClientState;
    getReplicator():ReplicatorClient<any>;
    setReplicator(replicator:ReplicatorClient<any>);
    setPredicted(command:string, handler:Function):void;
    remote:boolean;
    startSync();
    stopSync();
}