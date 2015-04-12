///<reference path="..\replication\replicator-client.ts"/>
///<reference path="client-user-game.ts"/>
class ClientUserGameImpl implements ClientUserGame {
    private info;
    private replicatorClient:ReplicatorClient<any>;

    public execute:(command:string, ...params:any[])=>void;
    public state:GameState;

    constructor(info:any, execute:(command:string, ...params:any[])=>void) {
        this.info = info;
        this.execute = execute;
        this.state={}; //TODO
    }

    public setReplicator(replicatorClient:ReplicatorClient<any>) {
        this.replicatorClient = replicatorClient;
    }

    public getInfo() {
        return this.info;
    }

}

export = ClientUserGameImpl;