import Transformer = require('./transformer');

function convert<T>(data:T, callback:(result:string)=>void):void {
    callback(JSON.stringify(data));
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

class JSONConverter<T> extends Transformer<T,string> {
    constructor(accepter:ConnectionAccepter<T>) {
        super(accepter, convert, convertBack);
    }
}

export = JSONConverter;