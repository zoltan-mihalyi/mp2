class ArraySet<T> {
    private data:T[] = [];

    public add(t:T):boolean {
        if (!this.contains(t)) {
            this.data.push(t);
            return true;
        }
        return false;
    }

    public contains(t:T):boolean {
        return this.data.indexOf(t) !== -1; //todo
    }

    public remove(t:T):boolean {
        var index = this.data.indexOf(t); //todo
        if (index !== -1) {
            this.data.splice(index, 1);
            return true;
        }
        return false;
    }

    public forEach(callback:(t:T)=>void):void {
        for (var i = 0; i < this.data.length; i++) {
            callback(this.data[i]);
        }
    }
}

export = ArraySet;