///<reference path="connection-accepter.ts"/>
///<reference path="messaging\join-event.ts"/>
///<reference path="messaging\command-event.ts"/>
///<reference path="replication\replicator-client.ts"/>
///<reference path="messaging\game-event.ts"/>
///<reference path="messaging\callback-event.ts"/>
///<reference path="messaging\replication-event.ts"/>
///<reference path="game\game-listener.ts"/>
import DiffReplicatorClient = require('./replication/diff/diff-replicator-client');
import GameListenerImpl = require('./game/game-listener-impl');
import IdSetImpl=require('./id-set-impl');
import IdMapImpl=require('./id-map-impl');
import ClientGameImpl=require('./game/client-game-impl');

interface CallbackContainer {
    nextId:number;
    callbacks:{[index:number]:Function};
}

class Client implements ConnectionAccepter<GameEvent,CommandEvent>, GameListener {
    private out:Writeable<Message<GameEvent>>;
    private listener:GameListener;
    private games:IdSet<ClientGameImpl> = new IdSetImpl<ClientGameImpl>();
    private callbacks:IdMap<ClientGame,CallbackContainer> = new IdMapImpl<ClientGame,CallbackContainer>();

    constructor(listener:GameListener) {
        this.listener = new GameListenerImpl(listener);
    }

    public accept(out:Writeable<Message<CommandEvent>>):Writeable<GameEvent> {
        if (this.out) {
            throw new Error('Client cannot accept more than one connection');
        }
        this.out = out;
        return {
            write: (event:GameEvent) => {
                var clientGame:ClientGameImpl;
                switch (event.eventType) {
                    case 'JOIN':
                        var joinEvent = <JoinEvent>event;
                        clientGame = new ClientGameImpl(joinEvent.gameId, joinEvent.info, {
                            onCommand: (command:string, index:number, params:any[])=> {
                                var callbacks:number[] = [];
                                for (var i = 0; i < params.length; i++) {
                                    var param = params[i];
                                    if (typeof  param === 'function') {
                                        params[i] = this.addCallback(clientGame, param);
                                        callbacks.push(i);
                                    }
                                }

                                var commandEvent:CommandEvent = {
                                    eventType: 'COMMAND',
                                    gameId: joinEvent.gameId,
                                    command: command,
                                    params: params,
                                    callbacks: callbacks,
                                    index: index
                                };

                                out.write({
                                    reliable: true,
                                    keepOrder: true,
                                    data: commandEvent
                                });
                            }
                        });
                        this.games.put(clientGame);
                        this.onJoin(clientGame);
                        break;
                    case 'LEAVE':
                        this.onLeave(this.getGame(<GameEvent>event));
                        break;
                    case 'CALLBACK':
                        var callbackEvent:CallbackEvent = <CallbackEvent>event;
                        clientGame = this.getGame(callbackEvent);
                        this.onCallback({
                            id: callbackEvent.callbackId,
                            clientGame: clientGame
                        }, callbackEvent.params);
                        break;
                    case 'REPLICATION':
                        var message:Message<any> = {
                            reliable: true,
                            keepOrder: true,
                            data: (<ReplicationEvent>event).replicationData
                        };
                        this.onReplication(this.getGame(event), (<ReplicationEvent>event).lastCommandIndex, message);
                        break;
                }
            },

            close: ()=> {
                this.out = null; //TODO more cleanup
            }
        };
    }

    private getGame(event:GameEvent):ClientGameImpl {
        return this.games.getIndex(event.gameId);
    }

    private addCallback(clientGame:ClientGame, callback:Function):number {
        var callbackContainer:CallbackContainer;
        if (!this.callbacks.contains(clientGame)) {
            callbackContainer = {
                nextId: 0,
                callbacks: {}
            };
            this.callbacks.put(clientGame, callbackContainer);
        } else {
            callbackContainer = this.callbacks.get(clientGame);
        }
        callbackContainer.callbacks[++callbackContainer.nextId] = callback;
        return callbackContainer.nextId;
    }

    onJoin(clientGame:ClientGame) {
        this.listener.onJoin(clientGame);
    }

    onLeave(clientGame:ClientGame) {
        this.listener.onLeave(clientGame);
        delete this.games[clientGame.id];
    }

    onCallback(callback:Callback, params:any[]) {
        var callbackFn = this.callbacks.get(callback.clientGame).callbacks[callback.id];
        callbackFn.apply(null, params);
        this.listener.onCallback(callback, params);
    }

    onReplication(clientGame:ClientGame, lastCommandIndex:number, message:Message<any>) {
        var replicationData = message.data;
        var state = clientGame.getState();
        if (!state) {
            throw new Error('State is not set in onJoin!');
        }
        var batch = state.createBatch();
        var replicator = clientGame.getReplicator();
        if (!replicator) {
            throw new Error('Replicator is not set in onJoin!'); //todo set repl and state at the same time?
        }
        replicator.onUpdate(replicationData, { //todo indention
            forEach: (c)=> {
                state.forEach(c);
            },
            merge: (item:IDProvider)=> {
                var existing = state.get(item.id);
                if (existing) {
                    batch.update(item);
                } else {
                    batch.create(item);
                }
            },
            remove: (id:number)=> {
                batch.remove(id);
            },
            contains: (id:number)=> {
                return typeof state.get(id) !== 'undefined';
            },
            create: (item:IDProvider)=> {
                batch.create(item);
            }
        });
        batch.apply();
        this.listener.onReplication(clientGame, lastCommandIndex, replicationData);

        clientGame.replayCommands(lastCommandIndex);
    }
}

export = Client;