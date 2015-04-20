///<reference path="messaging\message.ts"/>
///<reference path="messaging/user-event.ts"/>
///<reference path="game\server-user-game.ts"/>
///<reference path="game\game-listener.ts"/>
interface User extends GameListener{
    addUserGame(userGame:ServerUserGame):number;
    //send(message:Message<UserEvent>);
    forEachUserGame(callback:(ug:ServerUserGame)=>void):void;
    getUserGame(id:number):UserGame;
}