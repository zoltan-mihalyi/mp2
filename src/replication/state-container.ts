///<reference path="..\game\game-state.ts"/>
class StateContainer {
    protected state:GameState;

    constructor(state:GameState) {
        this.state = state;
    }
}

export = StateContainer;