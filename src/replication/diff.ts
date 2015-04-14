///<reference path="replicator.ts"/>
///<reference path="..\game\game-state.ts"/>
import replicators=require('../replication/replicators');

interface Diff { //todo rename file
    create:Array<any>;
    modify:Array<any>;
    remove:Array<any>;
}

class DiffReplicatorReceiver {
    protected state:GameState;

    public constructor(state:GameState) {
        this.state = state;
    }

    public onUpdate(message:Diff):void {
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

class ActiveDiffReplicator extends DiffReplicatorReceiver implements Replicator<Diff> {

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


class PassiveDiffReplicator extends DiffReplicatorReceiver implements Replicator<Diff> {

    private created;
    private modified;
    private removed;

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

replicators['active-diff'] = function (s:GameState) {
    return new ActiveDiffReplicator(s);
};

replicators['passive-diff'] = function (s:GameState) {
    return new PassiveDiffReplicator(s);
};