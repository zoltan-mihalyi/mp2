///<reference path="../id-provider.ts"/>
///<reference path="../replication/replicator-client.ts"/>
///<reference path="..\predicted-command.ts"/>
///<reference path="..\state\server-state.ts"/>
///<reference path="..\state\client-state.ts"/>
interface UserGame {
    getInfo():any;
    execute(command:string, ...params:any[]);
    setPredicted(command:string, handler:Function):void;
    setState(s:ClientState):void;
    getState():ClientState;
}