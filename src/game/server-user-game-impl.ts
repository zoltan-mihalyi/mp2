///<reference path="server-user-game.ts"/>
///<reference path="..\replication\replicator-server.ts"/>
///<reference path="..\user.ts"/>
import Game=require('./game');

class ServerUserGameImpl implements ServerUserGame {
    public game:Game;
    public user:User;
    public onLeave=function(){};
    public id; //TODO
    private replicatorServer:ReplicatorServer<any>;
    private idForUser;
    private commands:{[index:string]:Function} = {}; //todo
    public state:GameState={}; //todo

    execute(command:string, ...params) {
        this.commands[command].apply(params); //todo try
    }

    constructor(game:Game, user:User) {
        this.game = game;
        this.user = user;
        this.id = this.game.nextUserGameId();
        this.idForUser = this.user.nextUserGameId();
    }

    public setReplicator(replicatorServer:ReplicatorServer<any>) {
        this.replicatorServer = replicatorServer;
    }

    public getInfo() {
        return this.game.getInfo();
    }

    leave() {
        //TODO
        this.user.send({
            reliable: true,
            keepOrder: true,
            data: {
                action: 'LEAVE',
                data: null
            }
        });
    }

    public netUpdate() {
        var messages = this.replicatorServer.update();
        for (var i = 0; i < messages.length; i++) {
            var message = messages[i];
            this.user.send({
                reliable: message.reliable,
                keepOrder: message.keepOrder,
                data: {
                    action: 'GAME',
                    data: message.data
                }
            });
        }
    }

    public addCommand(name:string, callback:Function) {
        this.commands[name] = callback;
    }
}

export = ServerUserGameImpl;