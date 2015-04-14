///<reference path="connection-accepter.ts"/>
///<reference path="game\game-listener.ts"/>
///<reference path="messaging\user-event.ts"/>
///<reference path="messaging\join-event.ts"/>
///<reference path="messaging\leave-event.ts"/>
///<reference path="messaging\command-event.ts"/>
///<reference path="replication\replicator-client.ts"/>
import ClientUserGameImpl=require('./game/client-user-game-impl');
import BruteForceReplicatorClient = require('./replication/brute-force/brute-force-replicator-client');
import DiffReplicatorClient = require('./replication/diff/diff-replicator-client');

class Client implements ConnectionAccepter<UserEvent> {
    private out:Writeable<Message<UserEvent>>;
    private gameListener:GameListener<ClientUserGame>;


    constructor(gameListener:GameListener<ClientUserGame>) {
        this.gameListener = gameListener;
    }

    public accept(out:Writeable<Message<UserEvent>>):Writeable<UserEvent> {
        var client = this;
        if (this.out) {
            throw new Error('Client cannot accept more than one connection');
        }
        this.out = out;
        return {
            write: function (data:UserEvent) {

                switch (data.action) {
                    case 'JOIN':
                        var joinEvent:JoinEvent = data.data;
                        var replicator=getReplicator(joinEvent.replicator);
                        var userGame = new ClientUserGameImpl(joinEvent.info,replicator, function () {
                            client.out.write({ //TODO
                                reliable: true,
                                keepOrder: true,
                                data: {
                                    action: 'COMMAND',
                                    data: encodeParams(userGame, arguments)
                                }
                            });
                        });
                        client.gameListener.onJoin(userGame);
                        break;
                    case 'LEAVE':
                        var leaveEvent:LeaveEvent = data.data;
                        //TODO cleanup
                        break;
                    case 'GAME':
                        break;
                    default:
                        console.log('Unknown action: ' + data.action);
                }
                if (data.action === 'JOIN') {
                } else if (data.action === 'GAME') {
                    //this.currentUserGame.start();
                }
            },

            close: function () {
                client.out = null; //TODO more cleanup
            }
        };
    }

    write(message:string) {
        var client = this;
    }
}

function getReplicator(id:number):(new (state: GameState)=> ReplicatorClient<any>){
    switch(id){
        case 0:
            return BruteForceReplicatorClient;
        case 1:
            return DiffReplicatorClient;
    }
}

function addCallback(game, fn) {
    if (!game.callbacks) {
        game.callbacks = {};
        game.nextCallbackId = 0;
    }

    game.callbacks[game.nextCallbackId] = fn;

    return game.nextCallbackId++;
}

function encodeParams(game, args:IArguments):CommandEvent {
    var params = Array.prototype.splice.call(args, 0);
    var callbacks:number[]=[];
    for (var i = 0; i < params.length; i++) {
        var param = params[i];
        if (typeof  param === 'function') {
            params[i] = addCallback(game, param);
            callbacks.push(i);
        }
    }

    return {
        params: params,
        callbacks: callbacks
    };
}

export = Client;