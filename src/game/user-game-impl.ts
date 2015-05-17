///<reference path="user-game.ts"/>
///<reference path="../replication/replicator-client.ts"/>
///<reference path="..\user.ts"/>
///<reference path="..\replication\replicator-server.ts"/>
///<reference path="../relevance/relevance-set.ts"/>
///<reference path="..\relevance\relevance-set-factory.ts"/>
///<reference path="..\state\client-state.ts"/>
///<reference path="replication-state.ts"/>
import BruteForceReplicatorServer= require('../replication/brute-force/brute-force-replicator-server');
import Game=require('./game');
import ClientGameImpl=require('./client-game-impl');

class UserGameImpl implements UserGame, CommandListener {
    public game:Game;
    public user:User;
    public onLeave = function () {
    };
    public id;
    private state:ServerState;
    private relevanceSet:RelevanceSet;
    private relevanceSetReplicator:ReplicatorServer<any>;
    private commands:{[index:string]:Function} = {}; //todo
    private clientGame:ClientGame;
    public lastCommandIndex:number;
    private delays:number[] = [];
    private lastSyncTime:number;
    private lastSyncDelayedTime:number;
    public replicationState:ReplicationState = ReplicationState.BEFORE_FIRST_REPLICATION;
    private needSync = false;

    constructor(game:Game, user:User) {
        this.game = game;
        this.user = user;
        this.id = game.nextUserGameId();
        var clientGameId:number = user.addUserGame(this);
        this.state = game.getState();
        this.clientGame = new ClientGameImpl(clientGameId, this.game.getInfo(), this);
    }

    public enableSync() {
        this.replicationState = ReplicationState.WAITING_FOR_SYNC;
        this.needSync = true;
    }

    public getLastExecuted():number {
        return this.lastSyncDelayedTime;
    }

    private addToDelays(diff:number) {
        console.log(diff);
        for (var i = 0; i < this.delays.length; i++) {
            this.delays[i] += diff;
        }
    }

    private runCommand(index:number, now:number, afterDelay?:Function) {
        if (afterDelay) {
            afterDelay();
        }
        if (index) {
            this.lastCommandIndex = index;
            this.lastSyncDelayedTime = now;
        }
    }

    private sync(index:number, elapsed:number, afterDelay?:Function) {
        if (this.replicationState === ReplicationState.WAITING_FOR_SYNC) {
            this.replicationState = ReplicationState.BEFORE_FIRST_REPLICATION;
        }
        var now:number = new Date().getTime();
        if (!this.needSync) {
            this.runCommand(index, now, afterDelay);
            return;
        }
        if (!this.lastSyncTime) {
            this.lastSyncTime = now - elapsed;
        }
        this.lastSyncTime += elapsed;
        var neededDelay = this.lastSyncTime - now;
        this.delays.push(neededDelay);
        if (this.delays.length > 100) {
            this.delays.shift();
        }

        if (neededDelay < 0) {
            var correction = -neededDelay;
            this.lastSyncTime += correction;
            this.addToDelays(correction);
            neededDelay += correction;
        }
        setTimeout(()=> {
            this.runCommand(index, now + neededDelay, afterDelay);
        }, neededDelay);

        var min = Infinity;
        var max = 0;
        for (var i = 0; i < this.delays.length; i++) {
            var delay = this.delays[i];
            if (delay < min) {
                min = delay;
            }
            if (delay > max) {
                max = delay;
            }
        }

        if (min < Infinity && min > 10 + (max - min) / 3) {
            var correction = -min + 5;
            if (correction < -elapsed) {
                correction = -elapsed;
            }
            this.lastSyncTime += correction;
            this.addToDelays(correction);
        }
    }

    onSync(index:number, elapsed:number) {
        this.sync(index, elapsed);
    }

    onCommand(command:string, params:any[], index:number, elapsed:number) {
        this.sync(index, elapsed, ()=> {
            this.commands[command].apply(this, params);
        });
    }

    getRealState():ServerState {
        return this.state;
    }

    leave():void {
        var clientGame = this.getClientGame();
        this.user.onLeave(clientGame);
        this.game.onLeave(this);
        this.onLeave();
        if(!clientGame.remote){
            clientGame.stopSync();
        }
    }

    public addCommand(name:string, callback:Function):void {
        this.commands[name] = callback;
    }

    public setRelevanceSet(relevanceSet:RelevanceSet, Replicator?:ReplicatorServerFactory):void {
        this.relevanceSet = relevanceSet;
        Replicator = Replicator || BruteForceReplicatorServer;
        this.relevanceSetReplicator = new Replicator(this.relevanceSet);
    }

    public getRelevanceSet():RelevanceSet {
        return this.relevanceSet;
    }

    getReplicator():ReplicatorServer<any> {
        if (this.relevanceSet) {
            return this.relevanceSetReplicator;
        } else {
            return this.game.getReplicator();
        }
    }

    public getClientGame():ClientGame {
        return this.clientGame;
    }
}

export = UserGameImpl;