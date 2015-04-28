///<reference path="entity.ts"/>
///<reference path="..\server-state.ts"/>
interface WritableServerState extends ServerState{
    createEntity():Entity;
}