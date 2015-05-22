///<reference path="..\id-set.ts"/>
///<reference path="..\id-map.ts"/>
///<reference path="..\messaging\message.ts"/>
///<reference path="..\replication\replicator-server-factory.ts"/>
///<reference path="../state/server-replication-state.ts"/>
///<reference path="..\replication\replicator-server.ts"/>
///<reference path="replication-state.ts"/>
///<reference path="game.ts"/>
import IdSetImpl=require('../id-set-impl');
import UserGameImpl=require('./user-game-impl');
import GameListenerImpl=require('./game-listener-impl');
import BruteForceReplicatorServer= require('../replication/brute-force/brute-force-replicator-server');
import ArrayMap = require('../array-map');

class GameImpl extends GameListenerImpl<UserGame> implements Game{
    private info:any;
    private state:ServerState;
    private replicator:ReplicatorServer<any>;
    private userGames:IdSet<UserGame> = new IdSetImpl<UserGame>();
    private _nextUserGameId:number = 0;

    constructor(info:any, gameListener:ServerGameListener, state?:ServerState) {
        super(gameListener);
        this.info = info;
        this.state = state;
        if (state) {
            state.onRemove = (e:any)=> {
                this.userGames.forEach(function (ug:UserGame) { //todo improve
                    var rel = ug.getRelevanceSet();
                    if (rel) {
                        rel.remove(e);
                    }
                });
            }
        }
        this.setReplicator(BruteForceReplicatorServer);
    }

    public nextUserGameId() {
        return ++this._nextUserGameId;
    }

    public setReplicator(ReplicatorServer:ReplicatorServerFactory) {
        this.replicator = new ReplicatorServer(this.state);
    }

    public getReplicator():ReplicatorServer<any> {
        return this.replicator;
    }

    public getInfo():Object {
        return this.info;
    }

    public getState():ServerState {
        return this.state;
    }

    public addUser(user:User):UserGame {
        var userGame = new UserGameImpl(this, user);
        this.userGames.put(userGame);
        var clientGame:ClientGame = userGame.getClientGame();
        user.onUserGameJoin(userGame);
        this.onJoin(userGame);
        user.onJoin(clientGame);
        if(!clientGame.remote){
            clientGame.startSync();
        }
        return userGame;
    }

    public netUpdate():void {
        //az összes replikátorra mondunk egy update-et és elküldjük az usernek, de ami kétszer van, arra nem 2x!

        var replicatorMessages:ArrayMap<ReplicatorServer<any>, Message<any>[]> = new ArrayMap<ReplicatorServer<any>, Message<any>[]>();
        var now:number = new Date().getTime();
        this.userGames.forEach((userGame:UserGame)=> {
            var replicator:ReplicatorServer<any> = userGame.getReplicator();
            var messages:Message<any>[];
            var state = userGame.replicationState;
            switch (state) {
                case ReplicationState.WAITING_FOR_SYNC:
                    return;
                case ReplicationState.BEFORE_FIRST_REPLICATION:
                    messages = replicator.firstUpdate();
                    userGame.replicationState = ReplicationState.NORMAL;
                    break;
                case ReplicationState.NORMAL:
                    if (!replicatorMessages.contains(replicator)) {
                        messages = replicator.update();
                        replicatorMessages.put(replicator, messages);
                    } else {
                        messages = replicatorMessages.get(replicator);
                    }
            }

            for (var i = 0; i < messages.length; i++) {
                var message = messages[i];
                var clientGame = userGame.getClientGame();
                var lastExecuted = userGame.getLastExecuted();
                var elapsed = now - lastExecuted;
                userGame.user.onReplication(clientGame, userGame.lastCommandIndex, elapsed, message);
                this.onReplication(userGame, userGame.lastCommandIndex, elapsed, message);
            }
        });
    }
}

export = GameImpl;