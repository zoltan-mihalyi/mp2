///<reference path="../id-provider.ts"/>
///<reference path="game-state.ts"/>
///<reference path="../replication/replicator-client.ts"/>
interface UserGame {
    getInfo():any;
    execute(command:string, ...params:any[]);
    state:GameState;
}