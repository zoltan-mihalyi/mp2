///<reference path="..\id-provider.ts"/>

interface ServerReplicationState {
    forEach(callback:(e:IdProvider)=>void):void;
}