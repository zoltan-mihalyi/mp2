///<reference path="connection-accepter.ts"/>
///<reference path="game/user-game.ts"/>
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

    constructor(endpointListener?:ConnectionListener) {
        this.connectionListener = endpointListener || {
                onConnect: function () {
                }
            };
    }

    public accept(out:Writeable<Message<UserEvent>>):Writeable<CommandEvent> {
        var server = this;
        var result = {
            write: function (event:CommandEvent) { //TODO check client data
                var userGame = user.getUserGame(event.gameId);
                var params = [];
                for (var i = 0; i < event.params.length; i++) {
                    params[i] = event.params[i];
                }
                for (var i = 0; i < event.callbacks.length; i++) {
                    var callbackIndex = event.callbacks[i];
                    params[callbackIndex] = (function (callbackId) { //todo reduce indention
                        return function () {
                            user.onCallback(userGame, callbackId, Array.prototype.splice.call(arguments, 0));
                        }
                    })(params[callbackIndex]);
                }
                userGame.execute.apply(userGame, params);
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
            onJoin(userGame:ServerUserGame):void {
                var joinEvent:JoinEvent = {
                    eventType: 'JOIN',
                    gameId: userGame.idForUser,
                    info: userGame.getInfo(),
                    replicator: userGame.getState().getReplicator().typeId
                };
                out.write({
                    reliable: true,
                    keepOrder: true,
                    data: joinEvent
                });
            },
            onLeave(userGame:ServerUserGame) {
                var leaveEvent:GameEvent = {
                    eventType: 'LEAVE',
                    gameId: userGame.idForUser
                };
                out.write({
                    reliable: true,
                    keepOrder: true,
                    data: leaveEvent
                });
            },
            onReplication(userGame:ServerUserGame, message:Message<any>):void {
                var replicationEvent:ReplicationEvent = {
                    eventType: 'REPLICATION',
                    gameId: userGame.idForUser,
                    replicationData: message.data
                };
                out.write({
                    reliable: message.reliable,
                    keepOrder: message.keepOrder,
                    data: replicationEvent
                });
            },
            onCallback(userGame:ServerUserGame, callbackId:number, params:any[]):void {
                var callbackEvent:CallbackEvent = {
                    eventType: 'CALLBACK',
                    gameId: userGame.idForUser,
                    callbackId: callbackId,
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