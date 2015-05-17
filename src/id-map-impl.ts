///<reference path="id-provider.ts"/>
///<reference path="id-map.ts"/>
class IdMapImpl<K extends IdProvider, V> implements IdMap<K,V> {
    private map:{[index:number]:V} = {};

    put(key:K, value:V) {
        this.map[key.id] = value;
    }

    contains(key:K):boolean {
        return this.map.hasOwnProperty(key.id + '');
    }

    get(key:K):V {
        return this.map[key.id];
    }

    remove(key:K):void {
        delete this.map[key.id];
    }
}

export = IdMapImpl;