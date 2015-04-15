///<reference path="game-event.ts"/>
interface CommandEvent extends GameEvent{
    params:any[];
    callbacks:number[];
}