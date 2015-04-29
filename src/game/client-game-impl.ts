///<reference path="client-game.ts"/>
///<reference path="..\replication\replicator-client.ts"/>
import ArrayMap = require('../array-map'); //todo

interface CommandListener {
    onCommand(command:string, params:any[]);
}

class ClientGameImpl implements ClientGame {
    private info:any;
    private commandListener:CommandListener;
    public id:number;
    private replicator:ReplicatorClient<any>;
    private predictedCommands:{[index:string]:Function} = {};
    private state:ClientState;
    private simulatedEntities:ArrayMap<any,any> = new ArrayMap<any,any>();

    constructor(id:number, info:any, commandListener:CommandListener) {
        this.id = id;
        this.info = info;
        this.commandListener = commandListener;
    }

    public getInfo():any {
        return this.info;
    }

    public execute(command:string, ...params:any[]) {
        var predictedCommand = this.predictedCommands[command];
        if (predictedCommand) {
            predictedCommand.apply(null, params);
        }
        this.commandListener.onCommand(command, params);
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

    public getSimulatedData(entity:any) {
        return this.simulatedEntities.get(entity);
    }

    public setPredicted(command:string, handler:Function):void {
        this.predictedCommands[command] = handler;
    }

    public setSimulated(entity:any, simulationData:any):void {
        this.simulatedEntities.put(entity, simulationData);
    }

}

export = ClientGameImpl;