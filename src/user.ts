///<reference path="messaging\message.ts"/>
///<reference path="messaging/user-event.ts"/>
///<reference path="game\server-user-game.ts"/>
interface User{
    addUserGame(userGame:ServerUserGame):number;
    send(message:Message<UserEvent>);
}