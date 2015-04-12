///<reference path="messaging\message.ts"/>
///<reference path="messaging/user-event.ts"/>
interface User{
    nextUserGameId():number;
    send(message:Message<UserEvent>);
}