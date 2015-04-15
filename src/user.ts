///<reference path="messaging\message.ts"/>
///<reference path="messaging/user-event.ts"/>
///<reference path="game\user-game.ts"/>
interface User{
    addUserGame(userGame:UserGame):number;
    send(message:Message<UserEvent>);
}