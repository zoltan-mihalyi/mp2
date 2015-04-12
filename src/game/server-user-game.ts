///<reference path="user-game.ts"/>
///<reference path="..\replication\replicator-server.ts"/>
///<reference path="..\user.ts"/>

interface ServerUserGame extends UserGame, IDProvider{
    setReplicator(replicatorServer:ReplicatorServer<any>);
    leave();
    netUpdate();
    user:User;
    onLeave:Function;
    addCommand(name:string,callback:Function);
}