///<reference path="messaging/writeable.ts"/>
interface ConnectionAccepter<I,O>{
    accept(out:Writeable<Message<O>>):Writeable<I>
}