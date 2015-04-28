///<reference path="../replicator-client.ts"/>
///<reference path="..\replicator-server.ts"/>
///<reference path="diff.ts"/>

import StateContainer=require('../state-container');

class ActiveDiffReplicatorServer extends StateContainer implements ReplicatorServer<Diff> {
    typeId:number = 1;
    private lastState:IDProvider[];

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

export = ActiveDiffReplicatorServer;