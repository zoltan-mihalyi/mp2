///<reference path="../messaging/join-event.ts"/>
///<reference path="..\id-set.ts"/>
///<reference path="..\id-map.ts"/>
///<reference path="..\messaging\message.ts"/>
///<reference path="..\replication\replicator-server-factory.ts"/>
///<reference path="..\state\server-state.ts"/>
///<reference path="..\replication\replicator-server.ts"/>
import IdSetImpl=require('../id-set-impl');
import IdMapImpl=require('../id-map-impl');
import ServerUserGameImpl=require('./server-user-game-impl');
import ServerEvents=require('../messaging/server-events');
import GameListenerImpl=require('./game-listener-impl');
import BruteForceReplicatorServer= require('../replication/brute-force/brute-force-replicator-server');
import ArrayMap = require('../array-map');


interface RemoveListener {
    entityRemoved(e:any);
}

class Game extends GameListenerImpl implements RemoveListener {
    private info:any;
    private state:RealServerState;
    private replicator:ReplicatorServer<any>;
    private userGames:IdSetImpl<ServerUserGame> = new IdSetImpl<ServerUserGame>();
    private _nextUserGameId:number = 0;

    constructor(info:any, gameListener:GameListener, state?:RealServerState) {
        super(gameListener);
        this.info = info;
        this.state = state;
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

    public getState():RealServerState {
        return this.state;
    }

    public addUser(user:User):ServerUserGame {
        var userGame = new ServerUserGameImpl(this, user);
        this.userGames.put(userGame);
        this.onJoin(userGame);
        user.onJoin(userGame);
        return userGame;
    }

    public netUpdate() {
        //az összes replikátorra mondunk egy update-et és elküldjük az usernek, de ami kétszer van, arra nem 2x!

        var replicatorMessages:ArrayMap<ReplicatorServer<any>, Message<any>[]> = new ArrayMap<ReplicatorServer<any>, Message<any>[]>();

        this.userGames.forEach((userGame:ServerUserGame)=> {
            var replicator:ReplicatorServer<any> = userGame.getReplicator();
            var messages:Message<any>[];
            if (!replicatorMessages.contains(replicator)) {
                messages = replicator.update();
                replicatorMessages.put(replicator, messages);
            } else {
                messages = replicatorMessages.get(replicator);
            }

            for (var i = 0; i < messages.length; i++) {
                var message = messages[i];
                //userGame.onReplication(message.data);
                userGame.user.onReplication(userGame, message);
                this.onReplication(userGame, message);
            }
        });
    }

    public entityRemoved(e:any):void {
        this.userGames.forEach(function (ug:ServerUserGame) { //todo improve
            var rel = ug.getRelevanceSet();
            if (rel) {
                rel.remove(e);
            }
        });
    }
}

export = Game;