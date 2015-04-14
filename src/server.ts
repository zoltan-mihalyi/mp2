///<reference path="connection-accepter.ts"/>
///<reference path="game/user-game.ts"/>
///<reference path="game\game-listener.ts"/>
///<reference path="messaging\command-event.ts"/>
import Game = require('./game/game');
import UserImpl = require('./user-impl');

interface ConnectionListener {
    onConnect(user:User):void;
    onDisconnect?(user:User):void;
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
        var server = this;
        var result = {
            write: function (event:UserEvent) { //TODO check client data
                console.log(event);
                switch (event.action) {
                    case 'COMMAND':
                        var commandEvent:CommandEvent=event.data;
                        for(var i=0;i<commandEvent.callbacks.length;i++){
                            commandEvent.params[commandEvent.callbacks[i]]=(function(i){
                                return function(){

                                }
                            })(i);
                        }
                        break;
                    case 'GAME':
                        break;
                    default:
                        console.log('Invalid action: ' + event.action);
                }
            },
            close: function () {
                if (server.connectionListener.onDisconnect) {
                    server.connectionListener.onDisconnect(user); //TODO clean up usergames
                }
            }
        };
        var user = new UserImpl(out);
        this.connectionListener.onConnect(user);
        return result;
    }
}

export = Server;