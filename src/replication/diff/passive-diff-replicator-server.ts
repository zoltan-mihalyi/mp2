///<reference path="../replicator-client.ts"/>
///<reference path="..\..\game\game-state.ts"/>
///<reference path="..\replicator-server.ts"/>
///<reference path="diff.ts"/>

import StateContainer=require('../state-container');

class PassiveDiffReplicatorServer extends StateContainer implements ReplicatorServer<Diff> {
    typeId:number = 1;

    private created;
    private modified;
    private removed;

    constructor(state:RealState) {
        super(state);
        state.onAdd = this.onAdd;
        state.onRemove = this.onRemove;
        //state.onModify=this.onModify; TODO
    }

    private onAdd = (obj)=> {
        this.created[obj.id] = obj;
    };
    private onModify = (obj)=> {
        this.modified[obj.id] = obj;
    };
    private onRemove = (obj)=> {
        this.removed[obj.id] = obj;
    };

    public update() {
        var ret = {
            create: this.created,
            modify: this.modified,
            remove: this.removed
        };

        this.created = {};
        this.removed = {};
        this.modified = {};

        return [{
            reliable: true,
            keepOrder: true,
            data: ret
        }];
    }
}

export = PassiveDiffReplicatorServer;