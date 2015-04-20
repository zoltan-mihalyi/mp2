///<reference path="entity.ts"/>
///<reference path="state.ts"/>
interface ClientStateBatch{
    //create(e:EntityData):void;
    merge(e:EntityData):void;
    remove(e:Entity):void;
    apply():void;
}

interface ClientState extends State{
    createBatch():ClientStateBatch;
    contains(e:EntityData):boolean;
    forEach(callback:(e:Entity)=>void):void;
}