///<reference path="./main.ts"/>
import Client=require('./client');
import Game=require('./game/game-impl');
import Server=require('./server-impl');
import BruteForceReplicatorClient=require('./replication/brute-force/brute-force-replicator-client');
import RelevanceSetVg=require('./relevance/relevance-set-vg-impl');
import WebsocketServer=require('./websocket-server');
import WebsocketClient=require('./websocket-client');
import JSONTransformer=require('./messaging/json-transformer');
import DelayTransformer=require('./messaging/delay-transformer');

var mp:Main = {
    Client: Client,
    BruteForceReplicatorClient: BruteForceReplicatorClient,
    Server: Server,
    Game:Game,
    RelevanceSetVg: RelevanceSetVg,
    WebsocketServer: WebsocketServer,
    WebsocketClient:WebsocketClient,
    JSONTransformer:JSONTransformer,
    DelayTransformer:DelayTransformer
};

export = mp;