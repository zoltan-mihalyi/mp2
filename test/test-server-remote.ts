import server=require('./test-server');
import WebsocketServer=require('../src/websocket-server');
import JSONTransformer=require('../src/messaging/json-transformer');
import DelayTransformer=require('../src/messaging/delay-transformer');
import http=require('http');
import nodeStatic=require('node-static');


var transformer:ConnectionAccepter<any, any> = new JSONTransformer(server);

transformer = new DelayTransformer(transformer, 1, 500);

var fileServer = new nodeStatic.Server('../',{
    cache:1
});
var httpServer = http.createServer(function (request, response) {
    request.addListener('end', function () {
        //if(request.url==='/target/browser/test/grape-engine.js'){
        //    fileServer.serveFile('test/grape.js', 200, {}, request, response);
        //}else {
            fileServer.serve(request, response);
        //}
    }).resume();
}).listen(8080);

var websocketServer = new WebsocketServer(transformer, {server: httpServer});