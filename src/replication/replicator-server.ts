///<reference path="..\messaging\message.ts"/>
///<reference path="../game/server-state.ts"/>
interface ReplicatorServer<T>{
    setState(state:ReadableServerGameState):void;
    update():Message<T>[];
    typeId:number;
}
//TODO game ne tudjon nem-game üzenetet küldeni