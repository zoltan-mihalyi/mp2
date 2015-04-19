///<reference path="user.ts"/>
///<reference path="messaging\writeable.ts"/>
///<reference path="messaging/user-event.ts"/>
///<reference path="game\server-user-game.ts"/>
class UserImpl implements User {
    private nextId = 0;
    private out:Writeable<Message<UserEvent>>;
    private userGames:{[index:number]:ServerUserGame} = {};

    constructor(out:Writeable<Message<UserEvent>>) {
        this.out = out;
    }

    public getUserGame(id:number):UserGame {
        return this.userGames[id];
    }

    public addUserGame(userGame:ServerUserGame):number {
        var id = ++this.nextId;
        this.userGames[id] = userGame;
        return id;
    }

    public send(message:Message<UserEvent>) {
        this.out.write(message);
    }

    public forEachUserGame(callback:(ug:ServerUserGame)=>void) {
        for (var i in this.userGames) {
            callback(this.userGames[i]);
        }
    }
}

export = UserImpl;