///<reference path="game\entity.ts"/>
interface PredictedCommand {
    command:string;
    entities:{entity:Entity;attrs:string[]}[];
    simulate:Function;
    correction:(entity:Entity, key:string, value:any)=>void;
}