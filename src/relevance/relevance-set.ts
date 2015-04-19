///<reference path="../game/server-state.ts"/>
///<reference path="visibility-group.ts"/>
///<reference path="..\id-set.ts"/>
///<reference path="..\game\entity.ts"/>
interface EntityMap<T>{
    set(e:Entity,t:T);
    remove(e:Entity);
    increment(e:Entity):T;
    decrement(e:Entity):T;
}

interface RelevanceSet extends ReadableServerGameState{
    createVisibilityGroup(name:string):VisibilityGroup;
    toHide:IdSet<Entity>;
    toShow:IdSet<Entity>;
    entities:IdSet<Entity>;
    visibleNum:EntityMap<number>;
    setState(state:ServerGameState):void;
    getState():ServerGameState;
    removeEntity(entity:Entity):void;
}