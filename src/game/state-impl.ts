///<reference path="entity.ts"/>
///<reference path="state.ts"/>
class StateImpl implements State{
    public onAdd:(entity:Entity)=>void = function () { //TODO
    };

    public onRemove:(entity:Entity)=>void = function () {
    };
}

export = StateImpl;