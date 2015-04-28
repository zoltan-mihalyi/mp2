///<reference path="..\id-provider.ts"/>

interface ServerState {
    forEach(callback:(e:IDProvider)=>void):void;
}