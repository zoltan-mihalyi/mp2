/// <reference path="../id-provider.ts" />
///<reference path="entity.ts"/>

//import Set=require('../id-set-impl');

class EntityImpl implements Entity {
    public id:string;

    constructor(id:string) {
        this.id = id;
        //this.visibleFor = new IdSetImpl();
        //this.values = {};
        //this.connections = new IdSetImpl();
    }

    public set(name:string, value:any):void{ //TODO
        this[name]=value;
    }

    public get(name):any{ //TODO
        return this[name];
    }
}

export = EntityImpl;