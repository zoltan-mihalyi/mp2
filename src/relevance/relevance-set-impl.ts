///<reference path="relevance-set.ts"/>

import IdSetImpl=require('../id-set-impl');

class RelevanceSetImpl<T extends IDProvider> implements RelevanceSet {
    private elements:IdSet<T> = new IdSetImpl<T>();
    private state:ServerState;

    constructor(state:ServerState){
        this.state=state;
    }

    remove(e:T):void {
        this.elements.remove(e);
    }

    forEach(callback:(item:IDProvider)=>void):void {
        this.elements.forEach(callback);
    }

    add(e:T){
        this.elements.put(e);
    }
}

export = RelevanceSetImpl;