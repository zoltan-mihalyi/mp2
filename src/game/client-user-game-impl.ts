///<reference path="../replication/replicator-client.ts"/>
///<reference path="client-user-game.ts"/>

class ClientUserGameImpl implements ClientUserGame {
    private info:any;
    private replicator:ReplicatorClient<any>;
    public execute:(command:string, ...params:any[])=>void;
    public state:GameState;

    constructor(info:any, Replicator:(new (s:GameState)=>ReplicatorClient<any>), execute:(command:string, ...params:any[])=>void) {
        this.execute = execute;
        this.state = {}; //TODO
        this.info = info;
        this.replicator = new Replicator(this.state);
    }

    public getInfo() {
        return this.info;
    }

}

export = ClientUserGameImpl;