///<reference path="..\state\client-state.ts"/>
interface ReplicatorClient<T> {
    onUpdate(message:T, batch:ReplicationClientStateBatch):void;
}