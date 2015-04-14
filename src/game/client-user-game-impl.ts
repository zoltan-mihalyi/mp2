///<reference path="..\replication\replicator.ts"/>
///<reference path="client-user-game.ts"/>

class ClientUserGameImpl implements ClientUserGame {
    private info:any;
    public execute:(command:string, ...params:any[])=>void;
    public state:GameState;

    constructor(info:any, execute:(command:string, ...params:any[])=>void) {
        this.info = info;
        this.execute = execute;
        this.state = {}; //TODO
    }

    public getInfo() {
        return this.info;
    }

}

export = ClientUserGameImpl;