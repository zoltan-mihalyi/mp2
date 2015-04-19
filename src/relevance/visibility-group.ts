///<reference path="..\game\entity.ts"/>
interface VisibilityGroup{
    add(entity:Entity):void;
    remove(entity:Entity):void;
    removeEntities(filter:(e:Entity)=>boolean):void;
}