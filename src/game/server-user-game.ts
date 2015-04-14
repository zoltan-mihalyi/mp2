///<reference path="user-game.ts"/>
///<reference path="..\user.ts"/>

interface ServerUserGame extends UserGame, IDProvider{
    setReplicator(name:string, state:GameState):void;
    leave();
    netUpdate();
    user:User;
    onLeave:Function;
    addCommand(name:string,callback:Function);
}