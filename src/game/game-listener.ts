///<reference path="user-game.ts"/>
interface GameListener<T extends UserGame>{
    onJoin?(usergame:T); //TODO optional?
    //TODO netUpdate?
}