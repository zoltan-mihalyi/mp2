///<reference path="..\src\game\client-user-game.ts"/>
///<reference path="..\src\game\user-game.ts"/>

import shared=require('./shared');

var theGame;

var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var clientEvents = {
    onJoin: function (userGame:UserGame) {

        if (userGame.getInfo() === 'login') {
            userGame.execute('login', 123, 123, function (message) {
                console.log(message);
            });
        } else {
            theGame = userGame;
            userGame.getState().onAdd = function (entity) {
                drawPixels(entity, true);
            };
            userGame.getState().onRemove = function (entity) {
                drawPixels(entity, false);
            };
        }
    }
};

var players={};

function drawPixels(entity:Entity, add:boolean) {
    if (entity.get('type') === 'chunk') {
        var cx = entity.get('x');
        var cy = entity.get('y');
        entity.forEach(function(key, value){
            var x:any = key.split(';');
            if (x.length !== 2) {
                return;
            }
            var y = parseFloat(x[1]);
            x = parseFloat(x[0]);
            ctx.fillStyle = add ? entity.get(key) : '#ffffff';
            ctx.fillRect(cx + x, cy + y, 1, 1);
        });
    } else if (entity.get('type') === 'player') {
        if(add) {
            theGame.setPredicted('move', shared(entity).move); //todo melyik játékos predicted??
            players[entity.id] = entity;
        }
    }
}

document.onkeydown = function (e) {
    if (e.keyCode === 39) {
        theGame.execute('move', 5, 0);
    }
    if (e.keyCode === 37) {
        theGame.execute('move', -5, 0);
    }
    if (e.keyCode === 40) {
        theGame.execute('move', 0, 5);
    }
    if (e.keyCode === 38) {
        theGame.execute('move', 0, -5);
    }
};

setInterval(function () {
    var canvas = <HTMLCanvasElement>document.getElementById('canvas2');
    canvas.width = canvas.width;
    for(var i in players) {
        var player = players[i];

        var context = canvas.getContext('2d');
        context.fillRect(player.get('x') - 1, player.get('y') - 1, 3, 3);
    }
}, 16);

export = clientEvents;