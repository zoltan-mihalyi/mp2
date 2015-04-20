import Client = require('../src/client');
import JSONTransformer=require('../src/messaging/json-transformer');
import WebsocketClient = require('../src/websocket-client');

import clientEvents=require('./test-client');

var client = new Client(clientEvents);

var transformer = new JSONTransformer(client);

var wsc = new WebsocketClient(transformer, 'ws://' + location.host);
