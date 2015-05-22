///<reference path="user.ts"/>
interface ConnectionListener {
    onConnect(user:User):void;
    onDisconnect?(user:User):void;
}