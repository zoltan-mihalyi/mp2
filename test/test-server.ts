///<reference path="..\src\game\game-listener.ts"/>
import Server = require('../src/server');

import Game= require('../src/game/game');
import DiffReplicator = require('../src/replication/diff');
import BruteForceReplicator= require('../src/replication/brute-force');
import RelevanceSetImpl= require('../src/relevance/relevance-set-impl');
import chunkCreator=require('./chunks');

function createServer(gameEvents?:GameListener<ServerUserGame>) {

    var server = new Server({
        onConnect: function (user) {
            login.addUser(user);
        }
    }, gameEvents);

    var login = new Game({
        onJoin: function (userGame:ServerUserGame) {
            userGame.setReplicator('brute-force',new RelevanceSetImpl(login));
            userGame.addCommand('login', function (name:string, password:string, callback:Function) {
                if (name === password) {
                    callback('ok');
                    userGame.leave();
                    game.addUser(userGame.user);
                } else {
                    callback('failed');
                }
            });
            //userGame.netUpdate();
        }
    }, 'info');

    var game = new Game({
        onJoin: function (userGame) {
            var relevanceSet = new RelevanceSetImpl(game.state);
            userGame.setReplicator('passive-diff',relevanceSet);
            userGame.addCommand('move', function (x:number, y:number) {
                var x1 = player.get('x');
                var y1 = player.get('y');

                player.set('y', y + y1);
                player.set('x', x + x1);

            });

            var chunksGroup = relevanceSet.createVisibilityGroup();
            var staticGroup = relevanceSet.createVisibilityGroup();

            var player = game.state.createEntity();
            player.set('type', 'player');
            player.set('x', 24);
            player.set('y', 24);
            staticGroup.add(player);
            staticGroup.add(world);

            var intervalId = setInterval(function () {

                var px = player.get('x');
                var py = player.get('y');

                chunksGroup.removeEntities(function (entity:Entity) {
                    return dist(entity.get('x') + 8, entity.get('y') + 8, px, py) > 60;
                });
                for (var i = 0; i < chunks.length; i++) {
                    var entity = chunks[i];
                    if (dist(entity.get('x') + 8, entity.get('y') + 8, px, py) <= 20) {
                        chunksGroup.add(entity);
                    }
                }
            }, 100);

            userGame.onLeave = function () {
                clearInterval(intervalId);
                game.state.removeEntity(player);
            }
        }
    }, 'game');

    var world = game.state.createEntity();

    var chunks = chunkCreator(game.state);

    world.set('time', 30);

    function dist(x1:number, y1:number, x2:number, y2:number) {
        var dx = x1 - x2;
        var dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    game.start();
    return server;
}

export = createServer;