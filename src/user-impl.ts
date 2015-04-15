///<reference path="user.ts"/>
///<reference path="messaging\writeable.ts"/>
///<reference path="messaging/user-event.ts"/>
///<reference path="game\user-game.ts"/>
class UserImpl implements User {
    private nextId = 0;
    private out:Writeable<Message<UserEvent>>;
    private userGames:{[index:number]:UserGame} = {};

    constructor(out:Writeable<Message<UserEvent>>) {
        this.out = out;
    }

    public getUserGame(id:number):UserGame {
        return this.userGames[id];
    }

    public addUserGame(userGame:UserGame):number {
        var id = ++this.nextId;
        this.userGames[id] = userGame;
        return id;
    }

    public send(message:Message<UserEvent>) {
        this.out.write(message);
    }
}

export = UserImpl;