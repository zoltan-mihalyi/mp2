/// <reference path="../id-provider.ts" />
///<reference path="entity.ts"/>

//import Set=require('../id-set-impl');

class EntityImpl implements Entity, EntityData {
    public id:number;
    [index:string]:any;

    constructor(id:number) {
        this.id = id;
        //this.visibleFor = new IdSetImpl();
        //this.values = {};
        //this.connections = new IdSetImpl();
    }

    public set(name:string, value:any):void { //TODO
        this[name] = value;
    }

    public get(name):any { //TODO
        return this[name];
    }

    public forEach(callback:(key:string, value:any)=>void):void {
        for (var i in this) {
            if (this.hasOwnProperty(i) && i !== 'id') {
                callback(i, this[i]);
            }
        }
    }

    public toObject():EntityData {
        return this;
    }
}

export = EntityImpl;