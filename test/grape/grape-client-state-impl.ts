///<reference path="..\..\src\state\client-state.ts"/>
///<reference path="instance-data.ts"/>
import GrapeStateCommon=require('./grape-state-common');
import classRegistry = require('./class-registry');

class GrapeClientStateImpl extends GrapeStateCommon implements ClientState {
    private scene:any;
    private byId:{[index:number]:any} = {};

    constructor(scene:any) {
        super();
        this.scene = scene;
    }

    get(id:number):any {
        return this.byId[id];
    }

    createBatch():ClientStateBatch {
        var toUpdate:EntityData[] = [];
        var created:{instance:any;links:{[index:string]:number}}[] = [];

        return {
            remove: (id:number):void => {
                this.byId[id].remove();
                delete this.byId[id];
            },

            create: (data:InstanceData):void => {
                var Cl:any = classRegistry.get(data.type);
                var instance = new Cl();
                instance.__id = data.id;
                for (var i in data.attrs) {
                    instance[i] = data.attrs[i];
                }
                created.push({
                    instance: instance,
                    links: data.links
                });
                this.byId[this.idOf(instance)] = instance;
            },

            update: (data:EntityData):void => {
                toUpdate.push(data);
            },
            apply: ()=> {
                for (var i = 0; i < created.length; i++) {
                    var c = created[i];
                    for (var j in c.links) {
                        c.instance[j] = this.byId[c.links[j]];
                    }
                }
                for (var i = 0; i < toUpdate.length; i++) {
                    var data = toUpdate[i];
                    var inst = this.byId[data.id];
                    for (var j in data.links) {
                        inst[j] = this.byId[data.links[j]];
                    }
                    for (var j in data.attrs) {
                        inst[j] = data.attrs[j];
                    }
                }
                for (var i = 0; i < created.length; i++) {
                    this.scene.add(created[i].instance);
                }
            }
        }
    }

    forEach(callback:(e:IdProvider)=>void):void {
        this.scene.get().forEach((e)=> {
            callback({id: this.idOf(e)});
        });
    }
}

export = GrapeClientStateImpl