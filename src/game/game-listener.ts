///<reference path="user-game.ts"/>
interface GameListener<T extends UserGame>{
    onJoin?(usergame:T):void; //TODO optional?
    //TODO netUpdate?
}