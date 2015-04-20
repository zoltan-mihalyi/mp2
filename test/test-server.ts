import Server = require('../src/server');

import Game= require('../src/game/game');
import PassiveDiffReplicatorServer = require('../src/replication/diff/passive-diff-replicator-server');
import BruteForceReplicatorServer= require('../src/replication/brute-force/brute-force-replicator-server');
import RelevanceSetImpl= require('../src/relevance/relevance-set-impl');
import chunkCreator=require('./chunks');
import shared=require('./shared');

    var server = new Server({
        onConnect: function (user) {
            login.addUser(user);
        }
    });

    var login = new Game({
        onJoin: function (userGame:ServerUserGame) {
            userGame.setRelevanceSet(new RelevanceSetImpl());
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
    }, 'login');

    var game = new Game({
        onJoin: function (userGame:ServerUserGame) {
            var relevanceSet = new RelevanceSetImpl();
            userGame.setRelevanceSet(relevanceSet);

            var chunksGroup = relevanceSet.createVisibilityGroup();
            var staticGroup = relevanceSet.createVisibilityGroup();

            var player = game.getState().createEntity();
            var playerController = game.getState().createEntity();
            playerController.attach('player',player);
            playerController.set('type','playerController');
            userGame.addCommand('move', shared.move(player));
            player.set('type', 'player');
            player.set('x', 24);
            player.set('y', 24);
            staticGroup.add(player);
            staticGroup.add(playerController);
            staticGroup.add(world);

            var intervalId = setInterval(function () {

                var px = player.get('x');
                var py = player.get('y');

                chunksGroup.removeEntities(function (entity:Entity) {
                    return dist(entity.get('x') + 8, entity.get('y') + 8, px, py) > 60;
                });
                game.getState().forEach(function (e:Entity) {
                    if (e.get('type') === 'player' || e.get('type') === 'chunk') {
                        if (dist(e.get('x') + 8, e.get('y') + 8, px, py) <= 20) {
                            chunksGroup.add(e);
                        }
                    }
                });
            }, 100);

            userGame.onLeave = function () {
                clearInterval(intervalId);
                game.getState().removeEntity(player);
            }
        }
    }, 'game');

    var world = game.getState().createEntity();

    var chunks = chunkCreator(game.getState());

    world.set('time', 30);

    function dist(x1:number, y1:number, x2:number, y2:number) {
        var dx = x1 - x2;
        var dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    setInterval(function () {
        game.netUpdate();
    }, 200);

export = server;