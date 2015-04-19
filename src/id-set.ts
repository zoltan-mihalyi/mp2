///<reference path="id-provider.ts"/>

interface IdSet<T extends IDProvider> {
    put(element:T):void;
    get(element:IDProvider):T;
    remove(item);
    forEach(callback:(value?:T, key?:string)=>void);
    contains(item):boolean;
}