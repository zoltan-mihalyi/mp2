///<reference path="client-game.ts"/>
///<reference path="server-user-game.ts"/>
interface GameListenerGeneric<T> {
    onJoin?(t:T):void;
    onLeave?(t:T):void;
    onReplication?(t:T, lastCommandIndex:number, elapsed:number, message:Message<any>):void;
    onCallback?(callback:Callback, params:any[]):void;
    onUserGameJoin?(userGame:ServerUserGame):void;
    onUserGameLeave?(userGame:ServerUserGame):void;
}

interface GameListener extends GameListenerGeneric<ClientGame> {
}

interface ServerGameListener extends GameListenerGeneric<ServerUserGame> {
}

interface Callback extends IDProvider {
    clientGame:ClientGame;
}