///<reference path="../replication/replicator-client.ts"/>
///<reference path="client-user-game.ts"/>
///<reference path="..\messaging\writeable.ts"/>
///<reference path="..\messaging\command-event.ts"/>

class ClientUserGameImpl implements ClientUserGame {
    private info:any;
    private replicator:ReplicatorClient<any>;
    private out:Writeable<Message<CommandEvent>>;
    private id:number;
    private callbacks:{[index:number]:Function} = {};
    private nextCallbackId = 0;
    public state:GameState;

    constructor(id:number, info:any, Replicator:(new (s:GameState)=>ReplicatorClient<any>), out:Writeable<Message<CommandEvent>>) {
        this.id = id;
        this.state = {}; //TODO
        this.info = info;
        this.replicator = new Replicator(this.state);
        this.out = out;
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
    }

    private addCallback(fn:Function):number {
        var id = ++this.nextCallbackId;
        this.callbacks[id] = fn;
        return id;
    }

    public getCallback(id:number):Function {
        return this.callbacks[id];
    }

}

export = ClientUserGameImpl;