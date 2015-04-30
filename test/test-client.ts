///<reference path="../typing/all.d.ts"/>
///<reference path="..\src\game\game-listener.ts"/>
///<reference path="..\src\game\client-game.ts"/>
import Grape=require('grape-engine');
import classes=require('./classes');
import GrapeClientState=require('./grape/grape-client-state-impl');
import Client = require('../src/client');
import BruteForceReplicatorClient = require('../src/replication/brute-force/brute-force-replicator-client');


function createClient(container:string, up:string, left:string, down:string, right:string):Client {
    var game = new Grape.Game({
        container: container,
        reservedKeys: [up, left, down, right]
    });

    return new Client({
        onJoin: function (clientGame:ClientGame) {
            if (clientGame.getInfo() === 'login') {
                clientGame.execute('login', 123, 123, function (message) {
                    console.log(message);
                });
            } else {
                var scene = new Grape.Scene();
                scene.addSystem(new classes.RenderSystem());
                scene.mpGame = clientGame;
                scene.keys = {
                    up: up,
                    left: left,
                    down: down,
                    right: right
                };
                game.start(scene);
                clientGame.setState(new GrapeClientState(scene));
                clientGame.setReplicator(new BruteForceReplicatorClient())
            }
        }
    });
}

export = createClient;