///<reference path="user-game.ts"/>
interface GameListener{
    onJoin?(userGame:UserGame):void;
    onLeave?(userGame:UserGame):void;
    onReplication?(userGame:UserGame,replicationData:any):void;
    onCallback?(userGame:UserGame,callbackId:number, params:any[]):void;
}