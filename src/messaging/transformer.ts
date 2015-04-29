///<reference path="writeable.ts"/>
///<reference path="..\connection-accepter.ts"/>

interface AsyncConvert<F,T> {
    (f:F, callback:(t:T)=>void):void;
}

class Transformer<InFrom,OutFrom,In,Out> implements ConnectionAccepter<In,Out> {
    private target:ConnectionAccepter<InFrom,OutFrom>;
    private convertIn:AsyncConvert<In,InFrom>;
    private convertOutFrom:AsyncConvert<OutFrom,Out>;

    constructor(target:ConnectionAccepter<InFrom,OutFrom>, convertOutFrom:AsyncConvert<OutFrom,Out>, convertIn:AsyncConvert<In,InFrom>) {
        this.target = target;
        this.convertIn = convertIn;
        this.convertOutFrom = convertOutFrom;
    }

    accept(out:Writeable<Message<Out>>):Writeable<In> {
        var t = this.target.accept({
            write: (m:Message<OutFrom>) => {
                this.convertOutFrom(m.data, function (data) {
                    out.write({
                        reliable: m.reliable,
                        keepOrder: m.keepOrder,
                        data: data
                    });
                });
            },
            close: function () {
                out.close();
            }
        });

        return {
            write: (m:In)=> {
                this.convertIn(m, function (result:InFrom) {
                    t.write(result);
                });
            },
            close: function () {
                t.close();
            }
        };
    }
}

export = Transformer;