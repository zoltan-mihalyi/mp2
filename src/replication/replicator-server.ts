///<reference path="..\messaging\message.ts"/>
///<reference path="..\game\game-state.ts"/>
interface ReplicatorServer<T>{
    setState(state:GameState):void;
    update():Message<T>[];
    typeId:number;
}
//TODO game ne tudjon nem-game üzenetet küldeni