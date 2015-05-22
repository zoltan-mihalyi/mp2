///<reference path="connection-acceptor.ts"/>
///<reference path="messaging/game-event.ts"/>
///<reference path="messaging/game-event.ts"/>
///<reference path="game\game-listener.ts"/>
interface Server extends ConnectionAcceptor<CommandEvent|SyncEvent,GameEvent>{
    createUser(listener:GameListener):User;
}