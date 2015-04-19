///<reference path="id-provider.ts"/>
///<reference path="id-set.ts"/>

class IdSetImpl<T extends IDProvider> implements IdSet<T> {
    private map:{[index:number]:T} = {};

    public put(element:T):void {
        this.map[element.id] = element;
    }

    public get(element:IDProvider):T {
        return this.map[element.id];
    }

    public remove(element:T) {
        delete this.map[element.id];
    }

    public contains(element:T) {
        return this.map.hasOwnProperty(element.id + '');
    }

    public forEach(callback:(value?:T, key?:string)=>void) {
        for (var i in this.map) {
            if (this.map.hasOwnProperty(i)) {
                callback(this.map[i], i);
            }
        }
    }
}

export = IdSetImpl;