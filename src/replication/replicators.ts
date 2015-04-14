///<reference path="replicator.ts"/>
///<reference path="..\game\game-state.ts"/>
var replicators:{[index:string]:(state:GameState)=>Replicator<any>} = {}; //TODO better api
export = replicators;