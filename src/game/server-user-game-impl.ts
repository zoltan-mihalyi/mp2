///<reference path="server-user-game.ts"/>
///<reference path="../replication/replicator-client.ts"/>
///<reference path="..\user.ts"/>
///<reference path="..\replication\replicator-server.ts"/>
///<reference path="..\messaging\replication-event.ts"/>
import Game=require('./game');

class ServerUserGameImpl implements ServerUserGame {
    public game:Game;
    public user:User;
    public onLeave = function () {
    };
    public id; //TODO
    public idForUser;
    private state:GameState;
    private commands:{[index:string]:Function} = {}; //todo

    constructor(game:Game, user:User) {
        this.game = game;
        this.user = user;
        this.id = this.game.nextUserGameId();
        this.idForUser = user.addUserGame(this);
        this.state = game.getState();
    }

    execute(command:string, ...params) {
        this.commands[command].apply(this, params); //todo try
    }

    getState():GameState {
        return this.state;
    }

    public getInfo() {
        return this.game.getInfo();
    }

    leave() {
        var leaveEvent:GameEvent = {
            eventType: 'LEAVE',
            gameId: this.id
        };
        this.user.send({
            reliable: true,
            keepOrder: true,
            data: leaveEvent
        });
    }

    public addCommand(name:string, callback:Function) {
        this.commands[name] = callback;
    }

    public setRelevanceSet(relevanceSet:RelevanceSet):void{
        this.state=relevanceSet;
        relevanceSet.setState(this.game.getState());
    }
}

export = ServerUserGameImpl;