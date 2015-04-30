///<reference path="..\id-provider.ts"/>
interface ClientState {
    createBatch():ClientStateBatch;
    get(id:number):any;
    forEach(callback:(e:IDProvider)=>void):void;
}

interface ClientStateBatchCommon{
    remove(id:number):void;
    create(data:IDProvider):void;
}

interface ReplicationClientStateBatch extends ClientStateBatchCommon{
    forEach(callback:(e:IDProvider)=>void):void;
    merge(data:IDProvider):void;
}

interface ClientStateBatch extends ClientStateBatchCommon {
    apply():void;
    update(data:IDProvider):void;
}