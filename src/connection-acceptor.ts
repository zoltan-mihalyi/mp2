///<reference path="messaging/writeable.ts"/>
interface ConnectionAcceptor<I,O>{
    accept(out:Writable<Message<O>>):Writable<I>
}