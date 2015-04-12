interface Message<T> {
    reliable:boolean;
    keepOrder:boolean;
    data:T;
}