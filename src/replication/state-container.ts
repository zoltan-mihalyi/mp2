///<reference path="..\game\game-state.ts"/>
class StateContainer {
    protected state:GameState;

    setState(state:GameState):void {
        this.state = state;
    }
}

export = StateContainer;