///<reference path="user-game.ts"/>
///<reference path="..\user.ts"/>
///<reference path="..\replication\replicator-server.ts"/>
///<reference path="..\relevance\relevance-set.ts"/>

interface ServerUserGame extends UserGame, IDProvider {
    idForUser:number;
    leave();
    user:User;
    onLeave:Function;
    addCommand(name:string, callback:Function);
    setRelevanceSet(relevanceSet:RelevanceSet):void;
    getState():ReadableServerGameState;
}