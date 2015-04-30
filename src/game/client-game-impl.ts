///<reference path="client-game.ts"/>
///<reference path="..\replication\replicator-client.ts"/>
import ArrayMap = require('../array-map'); //todo

class ClientGameImpl implements ClientGame {
    private info:any;
    public id:number;
    private replicator:ReplicatorClient<any>;
    private predictedCommands:{[index:string]:Function} = {};
    private state:ClientState;
    private lastSimulated:{command:Function;params:any[];index:number}[] = [];
    private lastSimulatedId:number = 0;
    public onCommand:(command:string, index:number, params:any[])=>void;

    constructor(id:number, info:any, commandListener:CommandListener) {
        this.id = id;
        this.info = info;
        this.onCommand = function () {
            commandListener.onCommand.apply(commandListener, arguments);
        };
    }

    public getInfo():any {
        return this.info;
    }

    public replayCommands(lastIndex:number):void {
        lastIndex = lastIndex || 0;
        for (var i = 0; i < this.lastSimulated.length; i++) {
            if (this.lastSimulated[i].index === lastIndex) {
                this.lastSimulated.splice(0, i + 1); //remove at index i and everything before it
                break;
            }
        }
        for (var i = 0; i < this.lastSimulated.length; i++) {
            var lastSimulated = this.lastSimulated[i];
            lastSimulated.command.apply(null, lastSimulated.params);
        }
    }

    public execute(command:string, ...params:any[]) {
        var index;
        var predictedCommand = this.predictedCommands[command];
        if (predictedCommand) {
            predictedCommand.apply(null, params);
            index = ++this.lastSimulatedId;
            this.lastSimulated.push({
                command: predictedCommand,
                params: params, //todo.clone
                index: index //todo körben járjon
            });
        }
        this.onCommand(command, index, params);
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