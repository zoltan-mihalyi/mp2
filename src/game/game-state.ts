///<reference path="entity.ts"/>
interface GameState{
}

interface RealState extends GameState{
    onAdd:(e:Entity)=>void;
    onRemove:(e:Entity)=>void;
    //onChange:(Entity)=>void;
}