/// <reference path="../../id-provider.ts" />

interface EntityData extends IdProvider {
    attrs:{[index:string]:any};
    links:{[index:string]:number};
}

interface Entity extends IdProvider {
    set(name:string, value:any):void;
    get(name:string):any;
    attach(name:string, value:Entity):void;
    attachId(name:string, value:number):void;
    getLink(name:string):Entity;
    forEach(callback:(key:string, value:any)=>void):void;
    toObject():EntityData;
    merge(e:EntityData):void;
}