///<reference path="..\state\client-state.ts"/>
///<reference path="..\replication\replicator-client.ts"/>

interface CommandListener {
    onCommand(command:string, params:any[], index:number, elapsed:number):void;
    onSync(index:number, elapsed:number):void;
}

interface ClientGame extends IdProvider,CommandListener {
    getInfo():any;
    execute(command:string, ...params:any[]):void;
    executeSimulation(fn:Function):void;
    setState(state:ClientState):void;
    getState():ClientState;
    getReplicator():ReplicatorClient<any>;
    setReplicator(replicator:ReplicatorClient<any>):void;
    setPredicted(command:string, handler:Function):void;
    remote:boolean;
    startSync():void;
    stopSync():void;
    replaySimulation(index:number, elapsed:number):void;
}