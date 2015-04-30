///<reference path="..\state\client-state.ts"/>
///<reference path="..\replication\replicator-client.ts"/>

interface CommandListener {
    onCommand(command:string, index:number, params:any[]);
}

interface ClientGame extends IDProvider,CommandListener {
    getInfo():any;
    execute(command:string, ...params:any[]);
    setState(state:ClientState);
    getState():ClientState;
    getReplicator():ReplicatorClient<any>;
    setReplicator(replicator:ReplicatorClient<any>);
    setPredicted(command:string, handler:Function):void;
    replayCommands(lastIndex:number):void;
}