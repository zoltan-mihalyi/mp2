///<reference path="../replicator-client.ts"/>
///<reference path="..\replicator-server.ts"/>
///<reference path="diff.ts"/>

import StateContainer=require('../state-container');

class PassiveDiffReplicatorServer extends StateContainer implements ReplicatorServer<Diff> {
    typeId:number = 1;

    private created:IdProvider[] = [];
    private modified:IdProvider[] = [];
    private removed:number[] = [];

    public setState(state:ServerReplicationState) {
        //super.setState(state);
        //state.onAdd = this.onAdd;
        //state.onRemove = this.onRemove;
        //state.onModify=this.onModify; TODO
    }

    private onAdd = (obj)=> {
        this.created.push(obj);
    };
    private onModify = (obj)=> {
        this.modified.push(obj);
    };
    private onRemove = (obj)=> {
        this.removed.push(obj.id);
    };

    public update():Message<Diff>[] {
        var ret:Diff = {
            create: this.created,
            modify: this.modified,
            remove: this.removed
        };

        if (this.created.length + this.modified.length + this.removed.length === 0) {
            return [];
        }

        this.created = [];
        this.removed = [];
        this.modified = [];

        return [{ //todo multiple messages?
            reliable: true,
            keepOrder: true,
            data: ret
        }];
    }

    public firstUpdate(){
        return null;
    }
}

export = PassiveDiffReplicatorServer;