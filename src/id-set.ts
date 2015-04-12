///<reference path="id-provider.ts"/>

interface IdSet<T extends IDProvider> {
    put(element:T):void;
    remove(item);
    forEach(callback:(value?:T, key?:string)=>void);
    contains(item):boolean;
}