///<reference path="connection-accepter.ts"/>
///<reference path="game/user-game.ts"/>
///<reference path="game\game-listener.ts"/>
import Game = require('./game/game');
import UserImpl = require('./user-impl');

interface ConnectionListener {
    onConnect(user:User):void;
}

class Server implements ConnectionAccepter<UserEvent> {
    public connectionListener:ConnectionListener;
    public gameListener:GameListener<ServerUserGame>;

    constructor(endpointListener?:ConnectionListener, gameListener?:GameListener<ServerUserGame>) {
        this.connectionListener = endpointListener || {
            onConnect: function () {
            }
        };
        this.gameListener = gameListener || {};
    }

    public accept(out:Writeable<Message<UserEvent>>):Writeable<UserEvent> {
        var result = {
            write: function (event:UserEvent) {
                console.log(event);
                switch (event.action) {
                    case 'COMMAND':
                        break;
                }
            },
            close: function () {
                //TODO
            }
        };
        var user = new UserImpl(out);
        this.connectionListener.onConnect(user);
        return result;
    }
}

export = Server;