
///<reference path="game-listener.ts"/>
interface Game extends ServerGameListener{
    addUser(user:User):UserGame;
    netUpdate():void;
}