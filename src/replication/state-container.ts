///<reference path="../game/server-state.ts"/>
class StateContainer {
    protected state:ReadableServerGameState;

    setState(state:ReadableServerGameState):void {
        this.state = state;
    }
}

export = StateContainer;