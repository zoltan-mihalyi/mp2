///<reference path="game/client-game.ts"/>
///<reference path="client.ts"/>
///<reference path="replication/brute-force/brute-force-message.ts"/>
///<reference path="relevance\relevance-set-vg.ts"/>
///<reference path="connection-listener.ts"/>
///<reference path="game/game.ts"/>
///<reference path="server.ts"/>

interface Main {
    Client:{new(listener:GameListener): ConnectionAcceptor<GameEvent,CommandEvent>};
    BruteForceReplicatorClient:{new():ReplicatorClient<BruteForceMessage>};
    Server:{new(cl:ConnectionListener):Server}; //todo better interface
    Game:{new(info:any, gameListener:ServerGameListener, state?:ServerState):Game};
    RelevanceSetVg:{new(state:ServerState):RelevanceSetVg};
    WebsocketServer:{new(server:ConnectionAcceptor<string,string>, opts:any):any};
    WebsocketClient:{new(acceptor:ConnectionAcceptor<string,string>, url:string):any};
    JSONTransformer:{new(a:ConnectionAcceptor<any,any>):ConnectionAcceptor<string,string>};
    DelayTransformer:{new<A,B>(target:ConnectionAcceptor<A,B>,n1:number,n2:number):ConnectionAcceptor<A,B>};
}