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
import ClientGameImpl=require('./client-game-impl');

class ServerUserGameImpl implements ServerUserGame {
    public game:Game;
    public user:User;
    public onLeave = function () {
    };
    public id;
    private state:RealServerState;
    private relevanceSet:RelevanceSet;
    private relevanceSetReplicator:ReplicatorServer<any>;
    private clientState:ClientState;
    private commands:{[index:string]:Function} = {}; //todo
    private clientGame:ClientGame;
    public lastCommandIndex:number;

    constructor(game:Game, user:User) {
        this.game = game;
        this.user = user;
        this.id = game.nextUserGameId();
        var clientGameId:number = user.addUserGame(this);
        this.state = game.getState();
        this.clientGame = new ClientGameImpl(clientGameId, this.game.getInfo(), {
            onCommand: (command:string, index:number, params:any[])=> {
                this.commands[command].apply(this, params);
                if (index) {
                    this.lastCommandIndex = index;
                }
            }
        });
    }

    getRealState():RealServerState {
        return this.state;
    }

    leave():void {
        var clientGame = this.getClientGame();
        this.user.onLeave(clientGame);
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

export = ServerUserGameImpl;