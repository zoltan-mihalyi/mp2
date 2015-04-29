///<reference path="client-game.ts"/>
///<reference path="server-user-game.ts"/>
interface GameListenerGeneric<T> {
    onJoin?(t:T):void;
    onLeave?(t:T):void;
    onReplication?(t:T, message:Message<any>):void;
    onCallback?(callback:Callback, params:any[]):void;
}

interface GameListener extends GameListenerGeneric<ClientGame> {
}

interface ServerGameListener extends GameListenerGeneric<ServerUserGame> {
}

interface Callback extends IDProvider{
    clientGame:ClientGame;
    //call(params:any[]):void;
}