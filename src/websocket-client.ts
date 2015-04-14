///<reference path="connection-accepter.ts"/>
///<reference path="messaging\user-event.ts"/>

class WebsocketClient {
    constructor(accepter:ConnectionAccepter<string>, url:string) {
        var ws = new WebSocket(url);
        ws.onopen = function () {
            var target = accepter.accept({
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