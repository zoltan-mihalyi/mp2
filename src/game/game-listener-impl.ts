///<reference path="game-listener.ts"/>
function bind(fn:Function, context:any):Function {
    return function () {
        fn.apply(context, arguments);
    };
}

class GameListenerImpl<T> implements GameListenerGeneric<T> {
    constructor(listener:GameListenerGeneric<T>) {
        var events = ['onJoin', 'onLeave', 'onReplication', 'onCallback', 'onCallback', 'onUserGameJoin', 'onUserGameLeave'];
        for (var i = 0; i < events.length; i++) {
            var event = events[i];
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

    onUserGameJoin(userGame:ServerUserGame):void {
    }

    onUserGameLeave(userGame:ServerUserGame):void {
    }
}

export = GameListenerImpl;