///<reference path="relevance-set.ts"/>
///<reference path="visibility-group.ts"/>

interface RelevanceSetVg extends RelevanceSet {
    contains(e:any):boolean;
    createVisibilityGroup<T>():VisibilityGroup<T>;
}