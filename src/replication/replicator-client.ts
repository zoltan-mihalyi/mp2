///<reference path="..\game\game-state.ts"/>
interface ReplicatorClient<T>{
    setState(state:GameState):void;
    onUpdate(message:T);
}