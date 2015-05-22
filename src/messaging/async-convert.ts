interface AsyncConvert<F,T> {
    (f:F, callback:(t:T)=>void):void;
}