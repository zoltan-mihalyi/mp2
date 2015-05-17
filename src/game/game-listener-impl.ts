///<reference path="game-listener.ts"/>
function bind(fn:Function, context:any):Function {
    return function () {
        fn.apply(context, arguments);
    };
}

var EVENTS = ['onJoin', 'onLeave', 'onReplication', 'onCallback', 'onCallback', 'onUserGameJoin', 'onUserGameLeave'];

class GameListenerImpl<T> implements GameListenerGeneric<T> {
    constructor(listener:GameListenerGeneric<T>) {
        for (var i = 0; i < EVENTS.length; i++) {
            var event = EVENTS[i];
            if (listener[event]) {
                this[event] = bind(listener[event], listener);
            }
        }
    }

    onJoin(t:T):void {
    }

    onLeave(t:T):void {
    }

    onReplication(t:T, lastCommandIndex:number, elapsed:number, replicationData:Message<any>):void {
    }

    onCallback(callback:Callback, params:any[]):void {
    }

    onUserGameJoin(userGame:UserGame):void {
    }

    onUserGameLeave(userGame:UserGame):void {
    }
}

export = GameListenerImpl;