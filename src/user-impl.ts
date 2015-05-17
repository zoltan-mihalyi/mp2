///<reference path="user.ts"/>
///<reference path="messaging\writeable.ts"/>
///<reference path="game/user-game.ts"/>

import GameListenerImpl=require('./game/game-listener-impl');

class UserImpl extends GameListenerImpl<ClientGame> implements User {
    private nextId = 0;
    private userGames:{[index:number]:UserGame} = {};

    public getUserGame(id:number):UserGame {
        return this.userGames[id];
    }

    public addUserGame(userGame:UserGame):number {
        var id = ++this.nextId;
        this.userGames[id] = userGame;
        return id;
    }

    public forEachUserGame(callback:(ug:UserGame)=>void):void {
        for (var i in this.userGames) {
            callback(this.userGames[i]);
        }
    }
}

export = UserImpl;