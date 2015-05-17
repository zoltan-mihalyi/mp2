///<reference path="server.ts"/>
///<reference path="../typing/all.d.ts"/>

import ws=require('ws');

var WSServer = ws.Server;

class WebsocketServer {
    private server:ConnectionAcceptor<string,string>;
    private wss;

    constructor(server:ConnectionAcceptor<string,string>, opts:any) {
        this.server = server;
        this.wss = new WSServer(opts);

        this.wss.on('connection', function (ws) {
            var target=server.accept({
                write: function (m:Message<string>) {
                    //TODO reliable? keepOrder?
                    try {
                        ws.send(m.data);
                    }catch(e){
                    }
                },
                close: function () {
                    ws.close();
                }
            });

            ws.on('message', function(message:string){
                target.write(message);
            });

            ws.on('close', function(){
                target.close();
            });
        });
    }

    public close() {
        this.wss.close();
    }
}

export = WebsocketServer;