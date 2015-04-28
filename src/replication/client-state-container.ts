///<reference path="..\state\client-state.ts"/>
///<reference path="..\id-provider.ts"/>
class ClientStateContainer<T extends IDProvider> {
    protected state:ClientState;

    constructor(state:ClientState) {
        this.state = state;
    }
}

export = ClientStateContainer;