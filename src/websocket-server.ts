///<reference path="server.ts"/>
///<reference path="../typing/all.d.ts"/>

import ws=require('ws');
import ServerEvents=require('./messaging/server-events');

var WSServer = ws.Server;

class WebsocketServer {
    private server:ConnectionAccepter<string>;
    private wss;

    constructor(server:ConnectionAccepter<string>, port:number) {
        this.server = server;
        this.wss = new WSServer({port: port});

        this.wss.on('connection', function (ws) {
            var target=server.accept({
                write: function (m:Message<string>) {
                    //TODO reliable? keepOrder?
                    ws.write(m.data);
                },
                close: function () {
                    ws.close();
                }
            });

            ws.on('message', function(message:string){
                target.write(message);
            })
        });
    }

    public close() {
        this.wss.close();
    }
}

export = WebsocketServer;