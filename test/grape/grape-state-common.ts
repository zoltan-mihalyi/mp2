class GrapeStateCommon {
    private nextId:number = 0;

    protected idOf(instance) {
        if (!instance.__id) {
            instance.__id = ++this.nextId;
        }
        return instance.__id;
    }

}

export = GrapeStateCommon;