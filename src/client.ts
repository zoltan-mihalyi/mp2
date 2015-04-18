///<reference path="connection-accepter.ts"/>
///<reference path="game\game-listener.ts"/>
///<reference path="messaging\user-event.ts"/>
///<reference path="messaging\join-event.ts"/>
///<reference path="messaging\command-event.ts"/>
///<reference path="replication\replicator-client.ts"/>
///<reference path="messaging\game-event.ts"/>
///<reference path="messaging\callback-event.ts"/>
///<reference path="messaging\replication-event.ts"/>
import ClientUserGameImpl=require('./game/client-user-game-impl');
import BruteForceReplicatorClient = require('./replication/brute-force/brute-force-replicator-client');
import DiffReplicatorClient = require('./replication/diff/diff-replicator-client');

class Client implements ConnectionAccepter<UserEvent,GameEvent> {
    private out:Writeable<Message<GameEvent>>;
    private gameListener:GameListener<ClientUserGame>;
    private games:{[index:number]:ClientUserGameImpl} = {};

    constructor(gameListener:GameListener<ClientUserGame>) {
        this.gameListener = gameListener;
    }

    public accept(out:Writeable<Message<CommandEvent>>):Writeable<UserEvent> {
        var client = this;
        if (this.out) {
            throw new Error('Client cannot accept more than one connection');
        }
        this.out = out;
        return {
            write: function (data:UserEvent) {
                console.log(data.eventType);
                switch (data.eventType) {
                    case 'JOIN':
                        var joinEvent:JoinEvent = <JoinEvent>data;
                        var replicator:ReplicatorClient<any> = getReplicator(joinEvent.replicator);
                        var userGame = new ClientUserGameImpl(joinEvent.gameId, joinEvent.info, out);
                        userGame.setReplicator(replicator);
                        client.games[joinEvent.gameId] = userGame;
                        client.gameListener.onJoin(userGame);
                        break;
                    case 'LEAVE':
                        var leaveEvent:GameEvent = <GameEvent>data;
                        //TODO cleanup
                        break;
                    case 'CALLBACK':
                        var callbackEvent:CallbackEvent = <CallbackEvent>data;
                        client.games[callbackEvent.gameId].getCallback(callbackEvent.callbackId).apply(null, callbackEvent.params);
                        break;
                    case 'REPLICATION':
                        var replicationEvent:ReplicationEvent = <ReplicationEvent>data;
                        client.games[replicationEvent.gameId].getReplicator().onUpdate(replicationEvent.replicationData);
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

    write(message:string) {
        var client = this;
    }
}

function getReplicator(id:number):ReplicatorClient<any> {
    switch (id) {
        case 0:
            return new BruteForceReplicatorClient();
        case 1:
            return new DiffReplicatorClient();
    }
}

export = Client;