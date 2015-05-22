interface VisibilityGroup<T> {
    add(entity:T):void;
    remove(entity:T):void;
    removeEntities(filter:(e:T)=>boolean):void;
}