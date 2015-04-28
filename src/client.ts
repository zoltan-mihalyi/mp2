///<reference path="connection-accepter.ts"/>
///<reference path="messaging\user-event.ts"/>
///<reference path="messaging\join-event.ts"/>
///<reference path="messaging\command-event.ts"/>
///<reference path="replication\replicator-client.ts"/>
///<reference path="messaging\game-event.ts"/>
///<reference path="messaging\callback-event.ts"/>
///<reference path="messaging\replication-event.ts"/>
///<reference path="game\game-listener.ts"/>
import ClientUserGameImpl = require('./game/client-user-game-impl');
import BruteForceReplicatorClient = require('./replication/brute-force/brute-force-replicator-client');
import DiffReplicatorClient = require('./replication/diff/diff-replicator-client');
import GameListenerImpl = require('./game/game-listener-impl');

class Client implements ConnectionAccepter<UserEvent,GameEvent> {
    private out:Writeable<Message<GameEvent>>;
    private listener:GameListener;
    private games:{[index:number]:ClientUserGame} = {};

    constructor(listener:GameListener) {
        this.listener = new GameListenerImpl(listener);
    }

    public accept(out:Writeable<Message<CommandEvent>>):Writeable<UserEvent> {
        var client = this;
        var listener = this.listener;
        if (this.out) {
            throw new Error('Client cannot accept more than one connection');
        }
        this.out = out;
        return {
            write: function (data:UserEvent) {
                var userGame:ClientUserGame;
                console.log(data.eventType);
                switch (data.eventType) {
                    case 'JOIN':
                        var joinEvent:JoinEvent = <JoinEvent>data;
                        var replicator:ReplicatorClient<any> = getReplicator(joinEvent.replicator);
                        userGame = new ClientUserGameImpl(joinEvent.gameId, joinEvent.info, function(params, callbacks){
                            var commandEvent:CommandEvent = { //todo ne ide
                                eventType: 'COMMAND',
                                gameId: this.id,
                                params: params,
                                callbacks: callbacks
                            };

                            out.write({
                                reliable: true,
                                keepOrder: true,
                                data: commandEvent
                            });
                        });
                        userGame.setReplicator(replicator);
                        client.games[joinEvent.gameId] = userGame;
                        listener.onJoin(userGame);
                        break;
                    case 'LEAVE':
                        var leaveEvent:GameEvent = <GameEvent>data;
                        //TODO cleanup
                        listener.onLeave(client.games[leaveEvent.gameId]);
                        break;
                    case 'CALLBACK':
                        var callbackEvent:CallbackEvent = <CallbackEvent>data;
                        userGame = client.games[callbackEvent.gameId];
                        userGame.runCallback(callbackEvent.callbackId, callbackEvent.params);
                        listener.onCallback(userGame, callbackEvent.callbackId, callbackEvent.params);
                        break;
                    case 'REPLICATION':
                        var replicationEvent:ReplicationEvent = <ReplicationEvent>data;
                        userGame = client.games[replicationEvent.gameId];
                        var state = userGame.getState();
                        var batch = state.createBatch();
                        userGame.getReplicator().onUpdate(replicationEvent.replicationData, { //todo indention
                            forEach: (c)=> {
                                state.forEach(c);
                            },
                            merge: (item:IDProvider)=> {
                                var existing = state.get(item.id);
                                if (existing) {
                                    batch.update(item,userGame.getSimulatedData(existing));
                                } else {
                                    batch.create(item);
                                }
                            },
                            remove: (id:number)=> {
                                batch.remove(id);
                            },
                            contains: (id:number)=> {
                                return typeof state.get(id)!=='undefined';
                            },
                            create: (item:IDProvider)=> {
                                batch.create(item);
                            }
                        });
                        batch.apply();
                        listener.onReplication(userGame, replicationEvent.replicationData);
                        break;
                    default:
                        console.log('Unknown event: ' + data.eventType);
                }
            },

            close: function () {
                client.out = null; //TODO more cleanup
            }
        };
    }
}

function getReplicator(id:number):ReplicatorClient<any> {
    switch (id) {
        case 0:
            return new BruteForceReplicatorClient();
        case 1:
        //return new DiffReplicatorClient();
    }
}

export = Client;