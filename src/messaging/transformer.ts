///<reference path="writeable.ts"/>
///<reference path="user-event.ts"/>
///<reference path="..\connection-accepter.ts"/>

interface AsyncConvert<F,T> {
    (f:F, callback:(t:T)=>void):void;
}

class Transformer<F,T> implements ConnectionAccepter<T> {
    private target:ConnectionAccepter<F>;
    private convertF:AsyncConvert<F,T>;
    private convertT:AsyncConvert<T,F>;

    constructor(target:ConnectionAccepter<F>, convertF:AsyncConvert<F,T>, convertT:AsyncConvert<T,F>) {
        this.target = target;
        this.convertF = convertF;
        this.convertT = convertT;
    }

    accept(out:Writeable<Message<T>>):Writeable<T> {
        var t = this.target.accept({
            write: (m:Message<F>) => {
                this.convertF(m.data, function (data) {
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
            write: (m:T)=> {
                this.convertT(m, function (result:F) {
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