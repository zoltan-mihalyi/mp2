///<reference path="server-state.ts"/>
interface RealServerState extends ServerState{
    transform(real:any):IDProvider;
    onRemove:(instance:any)=>void;
}