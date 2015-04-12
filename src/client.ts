///<reference path="connection-accepter.ts"/>
///<reference path="game\game-listener.ts"/>
///<reference path="messaging\user-event.ts"/>
import ClientUserGameImpl=require('./game/client-user-game-impl');

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
                if (data.action === 'JOIN') {
                    var userGame = new ClientUserGameImpl(data.data[0], function () {
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
                } else if (data.action === 'GAME') {
                    //this.currentUserGame.start();
                }
            },

            close: function () {

            }
        };
    }

    write(message:string) {
        var client = this;
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

function encodeParams(game, args) {
    var params = Array.prototype.splice.call(args, 0);
    var callbacks = {};
    for (var i = 0; i < params.length; i++) {
        var param = params[i];
        if (typeof  param === 'function') {
            params[i] = addCallback(game, param);
            callbacks[i] = 1;
        }
    }

    return {
        params: params,
        callbacks: callbacks
    };
}

export = Client;