///<reference path="..\messaging\message.ts"/>
///<reference path="..\game\game-state.ts"/>
interface ReplicatorServer<T>{
    update():Message<T>[];
    typeId:number;
}
//TODO game ne tudjon nem-game �zenetet k�ldeni