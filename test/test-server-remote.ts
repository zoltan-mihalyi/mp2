import server=require('./test-server');
import WebsocketServer=require('../src/websocket-server');
import JSONTransformer=require('../src/messaging/json-transformer');
import DelayTransformer=require('../src/messaging/delay-transformer');

var transformer = new JSONTransformer(server);

var delayTransformer = new DelayTransformer(transformer, 1, 500);

var websocketServer = new WebsocketServer(delayTransformer, 1111);