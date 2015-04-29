///<reference path="..\src\game\user-game.ts"/>
///<reference path="../typing/all.d.ts"/>
///<reference path="..\src\game\game-listener.ts"/>
///<reference path="..\src\game\client-game.ts"/>
import Grape=require('grape-engine');
import classes=require('./classes');
import GrapeClientState=require('./grape/grape-client-state-impl');
import Client = require('../src/client');
import BruteForceReplicatorClient = require('../src/replication/brute-force/brute-force-replicator-client');

var game = new Grape.Game({
    container: 'game',
    reservedKeys: ['up', 'down']
});


var client:Client = new Client({
    onJoin: function (clientGame:ClientGame) {
        if (clientGame.getInfo() === 'login') {
            clientGame.execute('login', 123, 123, function (message) {
                console.log(message);
            });
        } else {
            var scene = new Grape.Scene();
            scene.addSystem(new classes.RenderSystem());
            scene.mpGame = clientGame;
            game.start(scene);
            clientGame.setState(new GrapeClientState(scene));
            clientGame.setReplicator(new BruteForceReplicatorClient())
        }
    }
});

export = client;