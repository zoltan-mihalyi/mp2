class ArrayMap<K, V> {
    private keys:K[] = [];
    private values:V[] = [];

    public put(k:K, v:V):void {
        var index = this.keys.indexOf(k); //todo
        if (index === -1) {
            this.keys.push(k);
            this.values.push(v);
        } else {
            this.values[index] = v;
        }
    }

    public remove(k:K) {
        var index = this.keys.indexOf(k); //todo
        if (index !== -1) {
            this.keys.splice(index, 1);
            this.values.splice(index, 1);
        }
    }

    public get(k:K):V {
        return this.values[this.keys.indexOf(k)];
    }

    public contains(k:K):boolean {
        return this.keys.indexOf(k) !== -1; //TODO
    }

    public forEach(callback:(key:K, value:V)=>void):void {
        for (var i = 0; i < this.keys.length; i++) {
            callback(this.keys[i], this.values[i]);
        }
    }
}

export = ArrayMap;