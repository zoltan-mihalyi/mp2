///<reference path="../game/server-state.ts"/>
///<reference path="..\game\client-state.ts"/>
class ClientStateContainer {
    protected state:ClientState;

    setState(state:ClientState):void {
        this.state = state;
    }
}

export = ClientStateContainer;