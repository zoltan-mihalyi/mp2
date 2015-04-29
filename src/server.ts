///<reference path="connection-accepter.ts"/>
///<reference path="messaging\command-event.ts"/>
///<reference path="messaging\game-event.ts"/>
///<reference path="messaging\callback-event.ts"/>
import Game = require('./game/game');
import UserImpl = require('./user-impl');

interface ConnectionListener {
    onConnect(user:User):void;
    onDisconnect?(user:User):void;
}

class Server implements ConnectionAccepter<CommandEvent,GameEvent> {
    public connectionListener:ConnectionListener;

    constructor(endpointListener?:ConnectionListener) {
        this.connectionListener = endpointListener || {
                onConnect: function () {
                }
            };
    }

    public accept(out:Writeable<Message<GameEvent>>):Writeable<CommandEvent> {
        var server = this;
        var result = {
            write: function (event:CommandEvent) { //TODO check client data
                var userGame:ServerUserGame = user.getUserGame(event.gameId);
                var params = [];
                for (var i = 0; i < event.params.length; i++) {
                    params[i] = event.params[i];
                }
                for (var i = 0; i < event.callbacks.length; i++) {
                    var callbackIndex = event.callbacks[i];
                    params[callbackIndex] = (function (callbackId) { //todo reduce indention
                        return function () {
                            user.onCallback({
                                id: callbackId,
                                clientGame: userGame.getClientGame()
                            }, Array.prototype.splice.call(arguments, 0));
                        }
                    })(params[callbackIndex]);
                }
                var clientGame = userGame.getClientGame();
                clientGame.execute.apply(clientGame,[event.command].concat(params));
                //userGame.execute.apply(userGame, [event.command].concat(params));
            },
            close: function () {
                if (server.connectionListener.onDisconnect) {
                    server.connectionListener.onDisconnect(user); //TODO clean up usergames
                }
                user.forEachUserGame(function (userGame:ServerUserGame) {
                    userGame.leave();
                });
            }
        };

        var user = this.createUser({ //todo redundancy
            onJoin(clientGame:ClientGame):void {
                var joinEvent:JoinEvent = {
                    eventType: 'JOIN',
                    gameId: clientGame.id,
                    info: clientGame.getInfo()
                };
                out.write({
                    reliable: true,
                    keepOrder: true,
                    data: joinEvent
                });
            },
            onLeave(clientGame:ClientGame) {
                var leaveEvent:GameEvent = {
                    eventType: 'LEAVE',
                    gameId: clientGame.id
                };
                out.write({
                    reliable: true,
                    keepOrder: true,
                    data: leaveEvent
                });
            },
            onReplication(clientGame:ClientGame, message:Message<any>):void {
                var replicationEvent:ReplicationEvent = {
                    eventType: 'REPLICATION',
                    gameId: clientGame.id,
                    replicationData: message.data
                };
                out.write({
                    reliable: message.reliable,
                    keepOrder: message.keepOrder,
                    data: replicationEvent
                });
            },
            onCallback(callback:Callback, params:any[]):void {
                var callbackEvent:CallbackEvent = {
                    eventType: 'CALLBACK',
                    gameId: callback.clientGame.id,
                    callbackId: callback.id,
                    params: params
                };
                out.write({
                    reliable: true,
                    keepOrder: true,
                    data: callbackEvent
                });
            }
        });
        return result;
    }

    public createUser(listener:GameListener):User {
        var user = new UserImpl(listener);
        this.connectionListener.onConnect(user);
        return user;
    }
}

export = Server;