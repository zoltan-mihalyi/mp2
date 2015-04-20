///<reference path="game-listener.ts"/>
class GameListenerImpl implements GameListener {
    constructor(listener:GameListener) {
        var events = ['onJoin', 'onLeave', 'onReplication', 'onCallback'];
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
            if (listener[event]) {
                this[event] = listener[event];
            }
        }
    }

    onJoin(userGame:UserGame):void {
    }

    onLeave(userGame:UserGame):void {
    }

    onReplication(userGame:UserGame, replicationData:any):void {
    }

    onCallback(userGame:UserGame):void {
    }
}

export = GameListenerImpl;