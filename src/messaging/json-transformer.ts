import Transformer = require('./transformer');

function convert<T>(data:T, callback:(result:string)=>void):void {
    var str;
    try {
        str = JSON.stringify(data);
    }catch(e){
        console.log('Stringify error:' ,data);
        return;
    }
    callback(str);
}

function convertBack<T>(data:string, callback:(result:T)=>void):void {
    var parsed;
    try {
        parsed = JSON.parse(data);
    } catch (e) {
        console.log('Parse error:' + data);
        return;
    }
    callback(parsed);
}

class JSONTransformer<In,Out> extends Transformer<In,Out,string,string> {
    constructor(acceptor:ConnectionAcceptor<In,Out>) {
        super(acceptor, convert, convertBack);
    }
}

export = JSONTransformer;