///<reference path="../id-provider.ts"/>
///<reference path="server-state.ts"/>
///<reference path="../replication/replicator-client.ts"/>
///<reference path="..\predicted-command.ts"/>
interface UserGame {
    getInfo():any;
    execute(command:string, ...params:any[]);
    getState():State;
    setPredicted(p:PredictedCommand):void;
}