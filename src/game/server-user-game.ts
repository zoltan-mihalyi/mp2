///<reference path="user-game.ts"/>
///<reference path="..\user.ts"/>
///<reference path="..\replication\replicator-server.ts"/>

interface ServerUserGame extends UserGame, IDProvider{
    replicator:ReplicatorServer<any>;
    idForUser:number;
    leave();
    netUpdate();
    user:User;
    onLeave:Function;
    addCommand(name:string,callback:Function);
}