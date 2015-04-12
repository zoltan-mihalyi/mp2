class EventEmitter<T> implements Listener<T>{
    private _events:{[event:string]:Array<Function>};

    public on(event:T, listener:Function){
        var eventString=event.toString();
        if(!this._events[eventString]){
            this._events[eventString]=[listener];
        }else{
            this._events[eventString].push(listener);
        }
    }

    public emit(event:T,payload?:any){
        var listeners=this._events[event.toString()];
        var i,n;
        if (listeners) {
            for (i = 0, n = listeners.length; i < n; i++) {
                listeners[i].call(this, payload);
            }
        }
    }
}

export = EventEmitter;