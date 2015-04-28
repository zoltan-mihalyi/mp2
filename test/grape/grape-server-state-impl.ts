///<reference path="instance-data.ts"/>
///<reference path="..\..\src\state\real-server-state.ts"/>
import GrapeStateCommon=require('./grape-state-common');
import classRegistry = require('./class-registry');

class GrapeServerStateImpl extends GrapeStateCommon implements RealServerState {
    private scene:any;

    constructor(scene:any) {
        super();
        this.scene = scene;
    }

    forEach(callback:(e:InstanceData)=>void):void {
        this.scene.forEach((instance)=>{
            callback(this.transform(instance));
        });
    }

    transform(instance:IDProvider):InstanceData {
        var attrs:{[index:string]:any} = {};
        var links:{[index:string]:number} = {};

        for (var i in instance) {
            if (instance.hasOwnProperty(i) && i.charAt(0) !== '_') {
                if (instance[i] && instance[i].getClass) { //ref
                    links[i] = this.idOf(instance[i]);
                } else {
                    attrs[i] = instance[i];
                }
            }
        }

        return {
            id: this.idOf(instance),
            type: classRegistry.getId(instance.constructor),
            attrs: attrs,
            links: links
        };
    }
}

export = GrapeServerStateImpl;