///<reference path="user.ts"/>
///<reference path="messaging\writeable.ts"/>
///<reference path="messaging/user-event.ts"/>
///<reference path="game\server-user-game.ts"/>
///<reference path="messaging\join-event.ts"/>
///<reference path="messaging\replication-event.ts"/>

import GameListenerImpl=require('./game/game-listener-impl');

class UserImpl extends GameListenerImpl implements User {
    private nextId = 0;
    private userGames:{[index:number]:ServerUserGame} = {};

    public getUserGame(id:number):UserGame {
        return this.userGames[id];
    }

    public addUserGame(userGame:ServerUserGame):number {
        var id = ++this.nextId;
        this.userGames[id] = userGame;
        return id;
    }

    public forEachUserGame(callback:(ug:ServerUserGame)=>void):void {
        for (var i in this.userGames) {
            callback(this.userGames[i]);
        }
    }
}

export = UserImpl;