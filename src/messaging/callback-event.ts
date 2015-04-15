///<reference path="game-event.ts"/>
interface CallbackEvent extends GameEvent{
    callbackId:number;
    params:any[];
}