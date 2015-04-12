///<reference path="entity.ts"/>
///<reference path="game-state.ts"/>
class RealStateImpl implements RealState{
    public onAdd:(e:Entity)=>void = function () {
    };
    public onRemove:(e:Entity)=>void = function () {
    };
}

export = RealStateImpl;