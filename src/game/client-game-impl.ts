///<reference path="client-game.ts"/>
///<reference path="..\replication\replicator-client.ts"/>
import ArrayMap = require('../array-map'); //todo

interface SyncData {
    lastSyncId:number;
    elapsed:number;
}

interface Simulation{
    command:Function;
    params:any[];
    index:number;
    elapsed:number;
}

class ClientGameImpl implements ClientGame {
    public syncInterval = 100; //todo
    private info:any;
    public id:number;
    private replicator:ReplicatorClient<any>;
    private predictedCommands:{[index:string]:Function} = {};
    private state:ClientState;
    private lastSimulated:Simulation[] = [];
    private lastSyncId:number = 0;
    private lastSync:number;
    public onCommand:(command:string, params:any[], index:number, elapsed:number)=>void;
    public onSync:(index:number, elapsed:number)=>void;
    private syncIntervalId;
    public remote:boolean = false;

    constructor(id:number, info:any, commandListener:CommandListener) {
        this.id = id;
        this.info = info;
        this.onCommand = function () {
            commandListener.onCommand.apply(commandListener, arguments);
        };
        this.onSync = function () {
            commandListener.onSync.apply(commandListener, arguments);
        };
    }

    public stopSync() {
        clearInterval(this.syncIntervalId);
    }

    public startSync() {
        this.sync();
        this.syncIntervalId = setInterval(()=> {
            this.sync();
        }, this.syncInterval);
    }

    public getInfo():any {
        return this.info;
    }

    public replaySimulation(index:number, elapsed:number):void {
        var lastToRemove = -1;
        for (var i = 0; i < this.lastSimulated.length; i++) {
            var simulated = this.lastSimulated[i];
            if (simulated.index < index || (simulated.index === index && simulated.elapsed <= elapsed)) {
                lastToRemove = i;
            } else {
                break;
            }
        }
        this.lastSimulated.splice(0, lastToRemove + 1);
        for (var i = 0; i < this.lastSimulated.length; i++) {
            var lastSimulated = this.lastSimulated[i];
            lastSimulated.command.apply(null, lastSimulated.params);
        }
    }

    public execute(command:string, ...params:any[]) {
        var syncData:SyncData = this.createSyncData();
        var predictedCommand = this.predictedCommands[command];
        if (predictedCommand) {
            predictedCommand.apply(null, params);
            this.lastSimulated.push({
                command: predictedCommand,
                params: params, //todo.clone
                index: syncData.lastSyncId,
                elapsed: 0
            });
        }
        this.onCommand(command, params, syncData.lastSyncId, syncData.elapsed);
    }

    public executeSimulation(fn:Function):void {
        this.lastSimulated.push({ //todo
            command: fn,
            params: [],
            index: this.lastSyncId,
            elapsed: new Date().getTime() - this.lastSync
        });
        fn();
    }

    private createSyncData():SyncData {
        var now = new Date().getTime();
        var elapsed = (this.lastSync ? now - this.lastSync : 0);
        this.lastSync = now;
        return {
            elapsed: elapsed,
            lastSyncId: ++this.lastSyncId
        }
    }

    public sync() {
        var syncData:SyncData = this.createSyncData();
        this.onSync(syncData.lastSyncId, syncData.elapsed);
    }

    public setState(state:ClientState):void {
        this.state = state;
    }

    public getState():ClientState {
        return this.state;
    }

    public setReplicator(replicator:ReplicatorClient<any>) {
        this.replicator = replicator;
    }

    public getReplicator():ReplicatorClient<any> {
        return this.replicator;
    }

    public setPredicted(command:string, handler:Function):void {
        this.predictedCommands[command] = handler;
    }

}

export = ClientGameImpl;