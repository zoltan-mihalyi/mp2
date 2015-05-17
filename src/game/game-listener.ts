///<reference path="client-game.ts"/>
///<reference path="user-game.ts"/>
interface GameListenerGeneric<T> {
    onJoin?(t:T):void;
    onLeave?(t:T):void;
    onReplication?(t:T, lastCommandIndex:number, elapsed:number, message:Message<any>):void;
    onCallback?(callback:Callback, params:any[]):void;
    onUserGameJoin?(userGame:UserGame):void;
    onUserGameLeave?(userGame:UserGame):void;
}

interface GameListener extends GameListenerGeneric<ClientGame> {
}

interface ServerGameListener extends GameListenerGeneric<UserGame> {
}

interface Callback extends IdProvider {
    clientGame:ClientGame;
}