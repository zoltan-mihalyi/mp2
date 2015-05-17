///<reference path="message.ts"/>
interface Writable<T>{
    write(data:T)
    close()
}