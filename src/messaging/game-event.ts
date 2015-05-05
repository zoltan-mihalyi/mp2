interface GameEvent {
    eventType:string; //TODO enum
    gameId:number;
}

interface JoinEvent extends GameEvent{
    info:any;
}

interface SyncEvent extends GameEvent{
    index:number;
    elapsed:number;
}

interface CommandEvent extends SyncEvent{
    command:string;
    params:any[];
    callbacks:number[];
}

interface CallbackEvent extends GameEvent{
    callbackId:number;
    params:any[];
}

interface ReplicationEvent extends GameEvent {
    replicationData:any;
    lastCommandIndex:number;
    elapsed:number;
}