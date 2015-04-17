///<reference path="game-listener.ts"/>
///<reference path="game-state.ts"/>
///<reference path="..\messaging\join-event.ts"/>
///<reference path="..\id-set.ts"/>
///<reference path="..\id-map.ts"/>
///<reference path="..\messaging\message.ts"/>
import IdSetImpl=require('../id-set-impl');
import IdMapImpl=require('../id-map-impl');
import GameStateImpl=require('./game-state-impl');
import ServerUserGameImpl=require('./server-user-game-impl');
import ServerEvents=require('../messaging/server-events');

class Game {
    private info:Object;
    private state:GameState;
    private userGames:IdSetImpl<ServerUserGame> = new IdSetImpl<ServerUserGame>();
    private gameListener:GameListener<ServerUserGame>;
    private _nextUserGameId:number = 0;
    private _nextGameStateId:number = 0;

    constructor(gameListener:GameListener<ServerUserGame>, info:Object) {
        this.gameListener = gameListener;
        this.info = info;
        this.setState(new GameStateImpl())
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

    public setState(state:GameState):void {
        state.id = 0;
        this.state = state;
    }

    public getState():GameState {
        return this.state;
    }

    public setInfo(info:Object) {
        this.info = info;
    } //TODO update ciklus

    public addUser(user:User):ServerUserGame {
        var userGame = new ServerUserGameImpl(this, user);
        this.userGames.put(userGame);
        this.gameListener.onJoin(userGame);
        var joinEvent:JoinEvent = {
            eventType: 'JOIN',
            gameId: userGame.idForUser,
            info: this.info,
            replicator: userGame.getState().getReplicator().typeId
        };
        user.send({
            reliable: true,
            keepOrder: true,
            data: joinEvent
        });
        return userGame;
    }

    public removeUser(user:User) {
        //todo
    }

    public netUpdate() {
        var stateMessages:IdMap<GameState, Message<any>[]> = new IdMapImpl<GameState,Message<any>[]>();
        this.userGames.forEach(function (userGame) {
            var state = userGame.getState();
            var messages:Message<any>[];
            if (!stateMessages.contains(state)) {
                messages = state.getReplicator().update();
                stateMessages.put(state, messages);
            } else {
                messages = stateMessages.get(state);
            }

            for (var i = 0; i < messages.length; i++) {
                var message = messages[i];
                var replicationEvent:ReplicationEvent = {
                    eventType: 'REPLICATION',
                    gameId: userGame.id,
                    replicationData: message.data
                };
                userGame.user.send({
                    reliable: message.reliable,
                    keepOrder: message.keepOrder,
                    data: replicationEvent
                });
            }
        });
    }
}

export = Game;