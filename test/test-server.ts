import Server = require('../src/server');

import Game = require('../src/game/game');
import PassiveDiffReplicatorServer = require('../src/replication/diff/passive-diff-replicator-server');
import BruteForceReplicatorServer = require('../src/replication/brute-force/brute-force-replicator-server');
import RelevanceSetVg = require('../src/relevance/relevance-set-vg');
import ChunkScene = require('./chunk-scene');
import GrapeServerState=require('./grape/grape-server-state-impl');
import classes=require('./classes');
import Grape=require('grape-engine');

var server = new Server({
    onConnect: function (user) {
        login.addUser(user);
    }
});

var login = new Game('login', {
    onJoin: function (userGame:UserGame) {
        userGame.addCommand('login', function (name:string, password:string, callback:Function) {
            if (name === password) {
                callback('ok');
                userGame.leave();
                game.addUser(userGame.user);
            } else {
                callback('failed');
            }
        });
    }
});

var scene = new ChunkScene();

scene.mpGame = {//todo
    execute: function () {
    },
    executeSimulation: function (fn) {
        fn();
    }
};

new Grape.Game({
    container: 'server-game'
}).start(scene);

var grapeServerState = new GrapeServerState(scene);
var game = new Game('game', {
    onJoin: function (userGame:UserGame) {
        var relevanceSet = new RelevanceSetVg(userGame.getRealState());
        userGame.setRelevanceSet(relevanceSet);

        var chunksGroup = relevanceSet.createVisibilityGroup<classes.Position>();
        var staticGroup = relevanceSet.createVisibilityGroup();

        var player:classes.Player = new classes.Player({x: 24, y: 24});
        scene.add(player);
        var playerController = new classes.PlayerController({player: player});
        userGame.addCommand('move', function (x, y) {
            player.move(x, y);
        });
        staticGroup.add(player);
        staticGroup.add(playerController);
        staticGroup.add(world);

        var intervalId = setInterval(function () {

            var px = player.x;
            var py = player.y;

            chunksGroup.removeEntities(function (entity:classes.Position) {
                return dist(entity.x + 8, entity.y + 8, px, py) > 30;
            });
            scene.get(Grape.Position, true).forEach(function (e:classes.Position) {
                if (dist(e.x + 8, e.y + 8, px, py) <= 28) {
                    chunksGroup.add(e);
                }
            });
        }, 100);

        userGame.onLeave = function () {
            clearInterval(intervalId);
            scene.remove(player);
        }
    }
}, grapeServerState);

var world = new classes.World();
world.time = 30;
scene.add(world);

function dist(x1:number, y1:number, x2:number, y2:number) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

setInterval(function () {
    game.netUpdate();
}, 200);

export = server;