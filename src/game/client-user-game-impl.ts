///<reference path="../replication/replicator-client.ts"/>
///<reference path="client-user-game.ts"/>
///<reference path="..\messaging\writeable.ts"/>
///<reference path="..\messaging\command-event.ts"/>
import GameStateImpl=require('./game-state-impl');

class ClientUserGameImpl implements ClientUserGame {
    private info:any;
    private replicator:ReplicatorClient<any>;
    private out:Writeable<Message<CommandEvent>>;
    private id:number;
    private callbacks:{[index:number]:Function} = {};
    private nextCallbackId = 0;
    private state:GameState;
    private predictedCommands:{[index:string]:Function} = {};

    constructor(id:number, info:any, out:Writeable<Message<CommandEvent>>) {
        this.id = id;
        this.state = new GameStateImpl(); //TODO
        this.info = info;
        this.out = out;
    }

    public getState():GameState {
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

        var commandEvent:CommandEvent = {
            eventType: 'COMMAND',
            gameId: this.id,
            params: params,
            callbacks: callbacks
        };

        this.out.write({ //TODO nem az egész executet kéne átadni tán
            reliable: true,
            keepOrder: true,
            data: commandEvent
        });
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

    public getCallback(id:number):Function {
        return this.callbacks[id];
    }

    public setPredicted(command:string, callback:Function):void {
        this.predictedCommands[command] = callback;
    }

    public getReplicator():ReplicatorClient<any> {
        return this.replicator;
    }

    public setReplicator(replicator:ReplicatorClient<any>):void {
        this.replicator = replicator;
        replicator.setState(this.state);
    }
}

export = ClientUserGameImpl;