///<reference path="user.ts"/>
///<reference path="messaging\writeable.ts"/>
///<reference path="messaging/user-event.ts"/>
class UserImpl implements User {
    private nextId = 0;
    private out:Writeable<Message<UserEvent>>;

    constructor(out:Writeable<Message<UserEvent>>) {
        this.out = out;
    }

    nextUserGameId() {
        return ++this.nextId;
    }

    public send(message:Message<UserEvent>) {
        this.out.write(message);
    }
}

export = UserImpl;