///<reference path="..\messaging\message.ts"/>
interface ReplicatorServer<T>{
    update():Message<T>[];
    firstUpdate():Message<T>[];
    typeId:number;
}