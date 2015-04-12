///<reference path="..\messaging\message.ts"/>
interface ReplicatorServer<T> {
    update():Message<T>[];
}