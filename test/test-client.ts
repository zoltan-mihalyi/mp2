///<reference path="..\src\game\client-user-game.ts"/>
///<reference path="..\src\game\user-game.ts"/>
///<reference path="../typing/all.d.ts"/>
///<reference path="..\src\game\game-listener.ts"/>
import Grape=require('grape-engine');
import classes=require('./classes');
import GrapeClientState=require('./grape/grape-client-state-impl');

var game = new Grape.Game({
    container: 'game',
    reservedKeys: ['up', 'down']
});


var clientEvents:GameListener = {
    onJoin: function (userGame:UserGame) {
        if (userGame.getInfo() === 'login') {
            userGame.execute('login', 123, 123, function (message) {
                console.log(message);
            });
        } else {
            var scene = new Grape.Scene();
            scene.addSystem(new classes.RenderSystem());
            scene.mpGame = userGame;
            game.start(scene);
            userGame.setState(new GrapeClientState(scene));
        }
    }
};

export = clientEvents;