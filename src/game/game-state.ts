///<reference path="entity.ts"/>
///<reference path="..\replication\replicator-server.ts"/>
///<reference path="..\id-provider.ts"/>
interface GameState extends IDProvider {
    createEntity():Entity;
    removeEntity(e:Entity):void;
    forEach(callback:(e:Entity)=>void):void;
    setReplicator(replicator:ReplicatorServer<any>); //todo kellenek metódusok?
    getReplicator():ReplicatorServer<any>;

    onAdd:(e:Entity)=>void;
    onRemove:(e:Entity)=>void;
    //onChange:(Entity)=>void;
}