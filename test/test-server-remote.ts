import server=require('./test-server');
import WebsocketServer=require('../src/websocket-server');
import JSONTransformer=require('../src/messaging/json-transformer');
import DelayTransformer=require('../src/messaging/delay-transformer');
import http=require('http');
import nodeStatic=require('node-static');


var transformer:ConnectionAcceptor<any, any> = new JSONTransformer(server);

transformer = new DelayTransformer(transformer, 1, 1000);

var fileServer = new nodeStatic.Server('../', {
    cache: 1
});
var httpServer = http.createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response);
    }).resume();
}).listen(8080);

var websocketServer = new WebsocketServer(transformer, {server: httpServer});