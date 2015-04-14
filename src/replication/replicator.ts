///<reference path="..\messaging\message.ts"/>
///<reference path="..\game\game-state.ts"/>
interface Replicator<T>{
    update():Message<T>[];
    onUpdate(message:T);
}
//
//
//
//var drs = new ActiveDiffReplicatorServer({});
//
//var users = {}; //no relevance
//
//function upd1() {
//    var diff = drs.update();
//    for (var i in users) {
//        users[i].stream.send(diff);
//    }
//}
//
//function upd2() {
//    for (var i in users) {
//        var diff = users[i].replicator.update();
//        users[i].stream.send(diff);
//    }
//}
//
//function superUpd() {
//    var updates = {};
//    for (var i in users) {
//        var replicator = users[i].replicator;
//        var upd = updates[replicator.id];
//        if (!upd) {
//            upd = replicator.update();
//            updates[replicator.id] = upd;
//        }
//        users[i].stream.send(upd);
//    }
//}

//
//class UserGame {
//    private send:Function;
//    private leave:Function;
//
//    constructor(opts) {
//        this.send = opts.send;
//        this.leave=opts.leave;
//    }
//}
//
//class User {
//    private nextId = 0;
//
//    public createUserGame(game):UserGame {
//        var id = this.nextId++;
//        this.send('JOIN', {id:id,info:game.getInfo()});
//        return new UserGame({
//            send:(data)=> {
//                this.send('GAME', {id: id, data: data});
//            },
//            leave:()=>{
//                this.send('LEAVE',{id:id});
//            }
//        });
//    }
//
//    public send(command, param) {
//        //ws send
//    }
//}

