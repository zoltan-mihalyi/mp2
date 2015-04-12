///<reference path="game-listener.ts"/>
///<reference path="game-state.ts"/>
import IdSetImpl=require('../id-set-impl');
import GameStateImpl=require('./game-state-impl');
import ServerUserGameImpl=require('./server-user-game-impl');
import ServerEvents=require('../messaging/server-events');

class Game {
    private info:Object;
    public state:GameStateImpl = new GameStateImpl();
    private userGames:IdSetImpl<ServerUserGame> = new IdSetImpl<ServerUserGame>();
    private gameListener:GameListener<ServerUserGame>;
    private nextId:number = 0;

    constructor(gameListener:GameListener<ServerUserGame>, info:Object) {
        this.gameListener = gameListener;
        this.info = info;
    }

    public nextUserGameId() {
        return ++this.nextId;
    }

    public getInfo():Object {
        return this.info;
    }

    public setInfo(info:Object) {
        this.info = info;
    }

    public start():void { //TODO realtime game?
        var game = this;
        setInterval(function () {
            //game.update();
        }, 15);
    }

    public addUser(user:User):ServerUserGame {
        var userGame = new ServerUserGameImpl(this, user);
        this.userGames.put(userGame);
        this.gameListener.onJoin(userGame);

        return userGame;
    }

    public removeUser(user:User) {

    }
}

export = Game;