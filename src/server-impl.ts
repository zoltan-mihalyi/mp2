///<reference path="messaging\game-event.ts"/>
///<reference path="connection-listener.ts"/>
///<reference path="server.ts"/>
import UserImpl = require('./user-impl');

class ServerImpl implements Server {
    public connectionListener:ConnectionListener;

    constructor(connectionListener?:ConnectionListener) {
        this.connectionListener = connectionListener || {
                onConnect: function () {
                }
            };
    }

    public accept(out:Writable<Message<GameEvent>>):Writable<CommandEvent|SyncEvent> {
        var server = this;
        var result = {
            write: function (event:CommandEvent|SyncEvent) { //TODO check client data
                var userGame:UserGame = user.getUserGame(event.gameId);
                if (event.eventType === 'COMMAND') {
                    var commandEvent = <CommandEvent>event;
                    var params = [];
                    for (var i = 0; i < commandEvent.params.length; i++) {
                        params[i] = commandEvent.params[i];
                    }
                    for (var i = 0; i < commandEvent.callbacks.length; i++) {
                        var callbackIndex = commandEvent.callbacks[i];
                        params[callbackIndex] = (function (callbackId) { //todo reduce indention
                            return function () {
                                user.onCallback({
                                    id: callbackId,
                                    clientGame: userGame.getClientGame()
                                }, Array.prototype.splice.call(arguments, 0));
                            }
                        })(params[callbackIndex]);
                    }
                    userGame.onCommand(commandEvent.command, params, event.index, event.elapsed);
                } else if (event.eventType === 'SYNC') {
                    userGame.onSync(event.index, event.elapsed);
                }
            },
            close: function () {
                if (server.connectionListener.onDisconnect) {
                    server.connectionListener.onDisconnect(user);
                }
                user.forEachUserGame(function (userGame:UserGame) {
                    userGame.leave();
                });
            }
        };

        var user = this.createUser({ //todo redundancy
            onJoin(clientGame:ClientGame):void {
                clientGame.remote = true;
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
            onReplication(clientGame:ClientGame, lastCommandIndex:number, elapsed:number, message:Message<any>):void {
                var replicationEvent:ReplicationEvent = {
                    eventType: 'REPLICATION',
                    gameId: clientGame.id,
                    replicationData: message.data,
                    lastCommandIndex: lastCommandIndex,
                    elapsed: elapsed
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
            },
            onUserGameJoin(userGame:UserGame) {
                userGame.enableSync();
            },
            onUserGameLeave(userGame:UserGame) {
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

export = ServerImpl;