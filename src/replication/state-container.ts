///<reference path="../state/server-replication-state.ts"/>
class StateContainer {
    protected state:ServerReplicationState;

    constructor(state:ServerReplicationState) {
        this.state = state;
    }
}

export = StateContainer;