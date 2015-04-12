///<reference path="../id-provider.ts"/>
///<reference path="game-state.ts"/>
interface UserGame {
    getInfo():any;
    execute(command:string,...params:any[]);
    state:GameState;
}