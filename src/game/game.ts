///<reference path="server-state.ts"/>
///<reference path="..\messaging\join-event.ts"/>
///<reference path="..\id-set.ts"/>
///<reference path="..\id-map.ts"/>
///<reference path="..\messaging\message.ts"/>
import IdSetImpl=require('../id-set-impl');
import IdMapImpl=require('../id-map-impl');
import ServerStateImpl=require('./server-state-impl');
import ServerUserGameImpl=require('./server-user-game-impl');
import ServerEvents=require('../messaging/server-events');

import GameListenerImpl=require('./game-listener-impl');

class Game extends GameListenerImpl implements GameListener {
    private info:any;
    private state:ServerGameState;
    private userGames:IdSetImpl<ServerUserGame> = new IdSetImpl<ServerUserGame>();
    private _nextUserGameId:number = 0;
    private _nextGameStateId:number = 0;

    constructor(gameListener:GameListener, info:any) {
        super(gameListener);
        this.info = info;
        this.setState(new ServerStateImpl())
    }

    public nextUserGameId() {
        return ++this._nextUserGameId;
    }

    public nextGameStateId() {
        return ++this._nextGameStateId;
    }

    public getInfo():Object {
        return this.info;
    }

    public setState(state:ServerGameState):void {
        state.id = 0;
        this.state = state;
    }

    public getState():ServerGameState {
        return this.state;
    }

    public setInfo(info:Object) {
        this.info = info;
    } //TODO update ciklus

    public addUser(user:User):ServerUserGame {
        var userGame = new ServerUserGameImpl(this, user);
        this.userGames.put(userGame);
        this.onJoin(userGame);
        user.onJoin(userGame);
        return userGame;
    }

    public removeUser(user:User) {
        //todo
    }

    public netUpdate() {
        var stateMessages:IdMap<ReadableServerGameState, Message<any>[]> = new IdMapImpl<ReadableServerGameState,Message<any>[]>();
        this.userGames.forEach((userGame:ServerUserGame)=> {
            var state = userGame.getState();
            state.netUpdate();
            var messages:Message<any>[];
            if (!stateMessages.contains(state)) {
                messages = state.getReplicator().update();
                stateMessages.put(state, messages);
            } else {
                messages = stateMessages.get(state);
            }

            for (var i = 0; i < messages.length; i++) {
                var message = messages[i];
                userGame.user.onReplication(userGame, message);
                this.onReplication(userGame, message);

            }
        });
    }
}

export = Game;