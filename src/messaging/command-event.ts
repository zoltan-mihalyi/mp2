///<reference path="game-event.ts"/>
interface CommandEvent extends GameEvent{
    command:string;
    params:any[];
    callbacks:number[];
    index:number;
}