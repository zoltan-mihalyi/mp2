///<reference path="..\game\game-state.ts"/>
///<reference path="visibility-group.ts"/>
///<reference path="..\id-set.ts"/>
///<reference path="..\game\entity.ts"/>
interface EntityMap<T>{
    set(e:Entity,t:T);
    remove(e:Entity);
    increment(e:Entity):T;
    decrement(e:Entity):T;
}

interface RelevanceSet extends GameState{
    createVisibilityGroup(name:string):VisibilityGroup;
    visible:IdSet<Entity>;
    toHide:IdSet<Entity>;
    toShow:IdSet<Entity>;
    visibleNum:EntityMap<number>;
    setState(state:GameState):void;
}