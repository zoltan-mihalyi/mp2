///<reference path="id-provider.ts"/>
class IdMap<K extends IDProvider, V> {
    private map:{[index:number]:V} = {};

    put(key:K, value:V) {
        this.map[key.id] = value;
    }

    contains(key:K):boolean {
        return this.map.hasOwnProperty(key.id+'');
    }

    get(key:K):V {
        return this.map[key.id];
    }
}

export = IdMap;