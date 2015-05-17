///<reference path="id-provider.ts"/>
///<reference path="id-set.ts"/>

class IdSetImpl<T extends IdProvider> implements IdSet<T> {
    private map:{[index:number]:T} = {};

    public put(element:T):void {
        this.map[element.id] = element;
    }

    public get(element:IdProvider):T {
        return this.map[element.id];
    }

    public getIndex(index:number):T {
        return this.map[index];
    }

    public remove(element:T) {
        delete this.map[element.id];
    }

    public removeIndex(index:number):void {
        delete this.map[index];
    }

    public contains(element:T):boolean {
        return this.map.hasOwnProperty(element.id + '');
    }

    public containsIndex(index:number):boolean {
        return this.map.hasOwnProperty(index + '');
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