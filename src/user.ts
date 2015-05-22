///<reference path="messaging\message.ts"/>
///<reference path="game/user-game.ts"/>
///<reference path="game\game-listener.ts"/>
interface User extends GameListener{
    addUserGame(userGame:UserGame):number;
    forEachUserGame(callback:(ug:UserGame)=>void):void;
    getUserGame(id:number):UserGame;
}