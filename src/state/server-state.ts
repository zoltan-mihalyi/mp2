///<reference path="server-replication-state.ts"/>
interface ServerState extends ServerReplicationState{
    transform(real:any):IdProvider;
    onRemove:(instance:any)=>void;
}