///<reference path="replicator-server.ts"/>
///<reference path="replicator-client.ts"/>
import StateContainer=require('./state-container');

interface Diff {
    create:Array<any>;
    modify:Array<any>;
    remove:Array<any>;
}

class ActiveDiffReplicatorServer extends StateContainer implements ReplicatorServer<Diff> {

    private lastState:GameState = {};

    public update() {
        var diff:Diff = {
            create: [],
            modify: [],
            remove: []
        };
        var state;
        for (var i in this.state) {
            if (this.lastState[i]) { //módosítás?
                for (var i in this.state[i]) {
                    if (this.state[i] !== this.lastState[i]) { //TODO új, régi propertyk?
                        diff.modify.push(this.state[i]);
                    }
                }
            } else { //létrehozás
                diff.create.push(this.state[i]);
            }

            state[i] = this.state[i]; //TODO deep copy
        }
        for (var i in this.lastState) {
            if (!this.state[i]) { //törlés
                diff.remove.push(this.lastState[i]);
            }
        }

        return [{
            reliable: true,
            keepOrder: true,
            data: diff
        }];
    }
}


class PassiveDiffReplicatorServer extends StateContainer implements ReplicatorServer<Diff> {

    private created;
    private modified;
    private removed;

    constructor(state:RealState) {
        super(state);
        state.onAdd=this.onAdd;
        state.onRemove=this.onRemove;
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

class DiffReplicatorClient extends StateContainer implements ReplicatorClient<Diff> {
    public onUpdate(message:Diff) {
        for (var i = 0; i < message.create.length; i++) {
            var newObject = message.create[i];
            this.state[newObject.id] = newObject;
        }
        for (var i = 0; i < message.remove.length; i++) {
            delete this.state[message.remove[i]];
        }
        for (var i = 0; i < message.modify.length; i++) {
            var mod = message.modify[i];
            this.state[mod.id] = mod;
        }
    }
}

var exp = {
    ActiveServer: ActiveDiffReplicatorServer,
    PassiveServer: PassiveDiffReplicatorServer,
    Client: DiffReplicatorClient
};

export = exp;