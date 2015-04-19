///<reference path="entity.ts"/>
///<reference path="state.ts"/>
interface ClientState extends State{
    contains(e:EntityData):boolean;
    create(e:EntityData):void;
    merge(e:EntityData):void;
    remove(e:Entity):void;
    forEach(callback:(e:Entity)=>void):void;
}