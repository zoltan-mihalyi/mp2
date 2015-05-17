///<reference path="id-provider.ts"/>

interface IdSet<T extends IdProvider> {
    put(element:T):void;
    get(element:IdProvider):T;
    getIndex(index:number):T;
    remove(item:T):void;
    removeIndex(index:number):void
    forEach(callback:(value?:T, key?:string)=>void);
    contains(item):boolean;
    containsIndex(index:number):boolean;
}