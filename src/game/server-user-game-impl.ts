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
    public replicator:ReplicatorServer<any>;
    private commands:{[index:string]:Function} = {}; //todo
    public state:GameState = {}; //todo

    execute(command:string, ...params) {
        this.commands[command].apply(this, params); //todo try
    }

    constructor(game:Game, user:User) {
        this.game = game;
        this.user = user;
        this.id = this.game.nextUserGameId();
        this.idForUser = user.addUserGame(this);
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

    public netUpdate() {
        var messages = this.replicator.update();
        for (var i = 0; i < messages.length; i++) {
            var message = messages[i];
            var gameEvent:ReplicationEvent = {
                eventType: 'REPLICATION',
                gameId: this.id,
                replicationData: message.data
            };
            this.user.send({
                reliable: message.reliable,
                keepOrder: message.keepOrder,
                data: gameEvent
            });
        }
    }

    public addCommand(name:string, callback:Function) {
        this.commands[name] = callback;
    }
}

export = ServerUserGameImpl;