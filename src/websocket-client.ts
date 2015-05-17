///<reference path="connection-acceptor.ts"/>

class WebsocketClient {
    constructor(acceptor:ConnectionAcceptor<string,string>, url:string) {
        var ws = new WebSocket(url);
        ws.onopen = function () {
            var target = acceptor.accept({
                write: function (message:Message<string>) {
                    //TODO reliable? keepOrder?
                    ws.send(message.data);
                },

                close: function () {
                    ws.close();
                }
            });

            ws.onmessage = function (event) {
                target.write(event.data);
            };
            ws.onclose = function () {
                target.close();
            };
        }
    }
}


export = WebsocketClient;