///<reference path="../game/server-state.ts"/>
///<reference path="../game/client-state.ts"/>
interface ReplicatorClient<T> {
    setState(state:ClientState):void;
    onUpdate(message:T):void;
}