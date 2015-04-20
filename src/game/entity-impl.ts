/// <reference path="../id-provider.ts" />
///<reference path="entity.ts"/>
///<reference path="..\id-set.ts"/>

//import Set=require('../id-set-impl');

class EntityImpl implements Entity {
    public id:number;
    private attrs:{[index:string]:any};
    private links:{[index:string]:number};
    private entities:IdSet<Entity>;

    constructor(data:EntityData, entities:IdSet<Entity>) {
        this.id = data.id;
        this.attrs = data.attrs;
        this.links = data.links;
        this.entities = entities;
    }

    public set(name:string, value:any):void {
        this.attrs[name] = value;
    }

    public get(name):any {
        return this.attrs[name];
    }

    public attach(name:string, value:Entity):void {
        this.links[name] = value.id;
    }

    public attachId(name:string, value:number):void {
        this.links[name] = value;
    }

    public getLink(name):Entity {
        return this.entities.get({id:this.links[name]});
    }

    public forEach(callback:(key:string, value:any)=>void):void {
        var attrs = this.attrs;
        for (var i in attrs) {
            if (attrs.hasOwnProperty(i)) {
                callback(i, attrs[i]);
            }
        }
    }

    public toObject():EntityData {
        return {
            id: this.id,
            attrs: this.attrs,
            links: this.links
        };
    }
}

export = EntityImpl;