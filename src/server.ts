///<reference path="connection-accepter.ts"/>
///<reference path="game/user-game.ts"/>
///<reference path="game\game-listener.ts"/>
///<reference path="messaging\command-event.ts"/>
///<reference path="messaging\game-event.ts"/>
///<reference path="messaging\callback-event.ts"/>
import Game = require('./game/game');
import UserImpl = require('./user-impl');

interface ConnectionListener {
    onConnect(user:User):void;
    onDisconnect?(user:User):void;
}

class Server implements ConnectionAccepter<GameEvent,UserEvent> {
    public connectionListener:ConnectionListener;
    public gameListener:GameListener<ServerUserGame>;

    constructor(endpointListener?:ConnectionListener, gameListener?:GameListener<ServerUserGame>) {
        this.connectionListener = endpointListener || {
            onConnect: function () {
            }
        };
        this.gameListener = gameListener || {};
    }

    public accept(out:Writeable<Message<UserEvent>>):Writeable<CommandEvent> {
        var server = this;
        var result = {
            write: function (event:CommandEvent) { //TODO check client data
                var params=[];
                for (var i = 0; i < event.params.length; i++) {
                    params[i]=event.params[i];
                }
                for (var i = 0; i < event.callbacks.length; i++) {
                    var callbackIndex = event.callbacks[i];
                    params[callbackIndex] = (function (callbackId) { //todo reduce indention
                        return function () {
                            var callbackEvent:CallbackEvent = {
                                eventType: 'CALLBACK',
                                gameId: event.gameId,
                                callbackId: callbackId,
                                params: Array.prototype.splice.call(arguments, 0)
                            };
                            out.write({
                                reliable: true,
                                keepOrder: true,
                                data: callbackEvent
                            });
                        }
                    })(params[callbackIndex]);
                }
                var userGame = user.getUserGame(event.gameId);
                userGame.execute.apply(userGame,params);
            },
            close: function () {
                if (server.connectionListener.onDisconnect) {
                    server.connectionListener.onDisconnect(user); //TODO clean up usergames
                }
            }
        };
        var user = new UserImpl(out);
        this.connectionListener.onConnect(user);
        return result;
    }
}

export = Server;