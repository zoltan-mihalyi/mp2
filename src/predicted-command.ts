///<reference path="id-provider.ts"/>
interface xPredictedCommand{
    command:string;
    affected:any[];
    onUpdate(newInstance); //TODO type?
    simulate:Function;
}