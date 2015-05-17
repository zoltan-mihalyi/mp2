///<reference path="..\id-provider.ts"/>
interface ClientState {
    createBatch():ClientStateBatch;
    get(id:number):any;
    forEach(callback:(e:IdProvider)=>void):void;
}

interface ClientStateBatchCommon{
    remove(id:number):void;
    create(data:IdProvider):void;
}

interface ReplicationClientStateBatch extends ClientStateBatchCommon{
    forEach(callback:(e:IdProvider)=>void):void;
    merge(data:IdProvider):void;
}

interface ClientStateBatch extends ClientStateBatchCommon {
    apply():void;
    update(data:IdProvider):void;
}