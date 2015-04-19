///<reference path="entity.ts"/>
///<reference path="..\replication\replicator-server.ts"/>
///<reference path="..\id-provider.ts"/>
///<reference path="..\relevance\relevance-set.ts"/>
///<reference path="state.ts"/>
interface ReadableServerGameState extends IDProvider, State {
    forEach(callback:(e:Entity)=>void):void;
    contains(entity:Entity):boolean;
    getReplicator():ReplicatorServer<any>;
}

interface ServerGameState extends ReadableServerGameState {
    createEntity():Entity;
    addEntity(e:Entity):void;
    removeEntity(e:Entity):void;
    setReplicator(replicator:ReplicatorServer<any>); //todo kellenek metódusok?
    entityAddedToRelevanceSet(entity:Entity, relevanceSet:RelevanceSet):void;
    entityRemovedFromRelevanceSet(entity:Entity, relevanceSet:RelevanceSet):void;
    //onChange:(Entity)=>void;
}