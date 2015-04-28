///<reference path="..\state\server-state.ts"/>
class StateContainer {
    protected state:ServerState;

    constructor(state:ServerState) {
        this.state = state;
    }
}

export = StateContainer;