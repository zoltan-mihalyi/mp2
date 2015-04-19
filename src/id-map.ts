///<reference path="id-provider.ts"/>
interface IdMap<K extends IDProvider, V>{
    put(key:K, value:V);
    contains(key:K):boolean;
    get(key:K):V;
    remove(key:K):void;
}