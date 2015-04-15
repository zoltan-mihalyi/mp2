import Transformer=require('./transformer');

function createDelay<T>(delay:number) {
    return function (data:T, callback:(t:T)=>void) {
        setTimeout(function () {
            callback(data);
        }, delay);
    }
}

class DelayConverter<In,Out> extends Transformer<In,Out,In,Out> {
    constructor(target:ConnectionAccepter<In,Out>, delay1:number, delay2:number) {
        super(target, createDelay(delay1), createDelay(delay2));
    }
}

export = DelayConverter;