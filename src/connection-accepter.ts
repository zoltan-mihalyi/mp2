///<reference path="messaging/writeable.ts"/>
interface ConnectionAccepter<T>{
    accept(out:Writeable<Message<T>>):Writeable<T>
}
