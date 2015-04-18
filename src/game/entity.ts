/// <reference path="../id-provider.ts" />

interface Entity extends IDProvider {
    set(name:string, value:any):void;
    get(name:string):any;
    forEach(callback:(key:string, value:any)=>void):void;
}