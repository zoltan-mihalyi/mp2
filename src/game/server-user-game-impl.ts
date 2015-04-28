///<reference path="server-user-game.ts"/>
///<reference path="../replication/replicator-client.ts"/>
///<reference path="..\user.ts"/>
///<reference path="..\replication\replicator-server.ts"/>
///<reference path="..\messaging\replication-event.ts"/>
///<reference path="../relevance/relevance-set.ts"/>
///<reference path="..\relevance\relevance-set-factory.ts"/>
///<reference path="..\state\client-state.ts"/>
import BruteForceReplicatorServer= require('../replication/brute-force/brute-force-replicator-server');
import Game=require('./game');

class ServerUserGameImpl implements ServerUserGame {
    public game:Game;
    public user:User;
    public onLeave = function () {
    };
    public id;
    public idForUser:number;
    private state:RealServerState;
    private relevanceSet:RelevanceSet;
    private relevanceSetReplicator:ReplicatorServer<any>;
    private clientState:ClientState;
    private commands:{[index:string]:Function} = {}; //todo

    constructor(game:Game, user:User) {
        this.game = game;
        this.user = user;
        this.id = game.nextUserGameId();
        this.idForUser = user.addUserGame(this);
        this.state = game.getState();
    }

    execute(command:string, ...params) {
        this.commands[command].apply(this, params); //todo try
    }

    getRealState():RealServerState {
        return this.state;
    }

    setState(state:ClientState) {
        this.clientState = state;
        this.user.onReplication = function (userGame:UserGame, replicationData:any) {

        }
    }

    getState():ClientState {
        return this.clientState;
    }

    public onReplication(data:any):void {
        //if (this.clientState) {
        //    this.clientState.cre
        //}
    }

    public getInfo() {
        return this.game.getInfo();
    }

    leave():void {
        this.user.onLeave(this);
        this.game.onLeave(this);
        this.onLeave();
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

    setPredicted():void {
        //skip
    }

    getReplicator():ReplicatorServer<any> {
        if (this.relevanceSet) {
            return this.relevanceSetReplicator;
        } else {
            return this.game.getReplicator();
        }
    }
}

export = ServerUserGameImpl;