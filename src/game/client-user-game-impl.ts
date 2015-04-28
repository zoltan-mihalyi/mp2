///<reference path="../replication/replicator-client.ts"/>
///<reference path="client-user-game.ts"/>
///<reference path="..\messaging\writeable.ts"/>
///<reference path="..\messaging\command-event.ts"/>
///<reference path="..\predicted-command.ts"/>
///<reference path="..\id-map.ts"/>
import IdSetImpl = require('../id-set-impl');
import IdMapImpl = require('../id-map-impl');
import ArrayMap = require('../array-map');

class ClientUserGameImpl implements ClientUserGame {
    private info:any;
    private state:ClientState;
    private replicator:ReplicatorClient<any>;
    private onCommand:Function;
    private id:number;
    private callbacks:{[index:number]:Function} = {};
    private nextCallbackId = 0;
    private predictedCommands:{[index:string]:Function} = {};
    private simulatedEntities:ArrayMap<any,any> = new ArrayMap<any,any>();

    constructor(id:number, info:any, onCommand:Function) {
        this.id = id;
        this.info = info;
        this.onCommand = onCommand;
    }

    public getState():ClientState {
        return this.state;
    }

    public getInfo() {
        return this.info;
    }

    public execute(...params:any[]):void {
        var callbacks:number[] = [];
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            if (typeof  param === 'function') {
                params[i] = this.addCallback(param);
                callbacks.push(i);
            }
        }

        this.onCommand(params, callbacks);
        var predictedCommand = this.predictedCommands[params[0]];
        if (predictedCommand) {
            predictedCommand.apply(null, params.slice(1));
        }
    }

    private addCallback(fn:Function):number {
        var id = ++this.nextCallbackId;
        this.callbacks[id] = fn;
        return id;
    }

    public setPredicted(command:string, handler:Function):void {
        this.predictedCommands[command] = handler;
    }

    public setSimulated(entity:any, simulationData:any):void {
        this.simulatedEntities.put(entity, simulationData);
    }

    public getSimulatedData(entity:any):any {
        return this.simulatedEntities.get(entity);
    }

    public getReplicator():ReplicatorClient<any> {
        return this.replicator;
    }

    public setReplicator(replicator:ReplicatorClient<any>):void {
        this.replicator = replicator;
    }

    public runCallback(id:number, params:any[]):void {
        this.callbacks[id].apply(null, params)
    }

    public setState(state:ClientState):void {
        this.state = state;
    }
}

export = ClientUserGameImpl;