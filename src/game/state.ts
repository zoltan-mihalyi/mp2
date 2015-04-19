///<reference path="entity.ts"/>
interface State {
    onAdd(entity:Entity):void;
    onRemove(entity:Entity):void; //TODO közös?
}