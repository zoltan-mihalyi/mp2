///<reference path="id-provider.ts"/>
///<reference path="id-set.ts"/>

class IdSetImpl<T extends IDProvider> implements IdSet<T> {
    private map:{[index:number]:T} = {};

    public put(element:T):void {
        this.map[element.id] = element;
    }

    public remove(item:T) {
        delete this.map[item.id];
    }

    public contains(item:T) {
        return this.map.hasOwnProperty(item.id + '');
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