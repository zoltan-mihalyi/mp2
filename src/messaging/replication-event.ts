///<reference path="game-event.ts"/>
interface ReplicationEvent extends GameEvent{
    replicationData:any;
    lastCommandIndex:number;
}