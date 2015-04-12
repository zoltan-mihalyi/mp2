///<reference path="message.ts"/>
interface Writeable<T>{
    write(message:T)
    close()
}