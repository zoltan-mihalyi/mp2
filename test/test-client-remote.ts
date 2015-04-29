import JSONTransformer=require('../src/messaging/json-transformer');
import WebsocketClient = require('../src/websocket-client');
import client=require('./test-client');

var transformer = new JSONTransformer(client);

var wsc = new WebsocketClient(transformer, 'ws://' + location.host);
