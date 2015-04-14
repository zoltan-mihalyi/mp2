///<reference path="..\src\game\client-user-game.ts"/>
///<reference path="..\src\game\user-game.ts"/>

var theGame;

var canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var clientEvents={
    onJoin: function (userGame:UserGame) {

        if (userGame.getInfo() === 'login') {
            //todo repl. mechanizmus kikerülése?
            userGame.execute('login', 123, 123, function (message) {
                console.log(message);
            });
        } else {
            theGame = userGame;
            (<RealState>userGame.state).onAdd = function (entity) {
                drawPixels(entity, true);
            };
            (<RealState>userGame.state).onRemove = function (entity) {
                drawPixels(entity, false);
            };
        }
    }
};

var player;

function drawPixels(entity, add:boolean) {
    if (entity.get('type') === 'chunk') {
        var cx = entity.get('x');
        var cy = entity.get('y');
        for (var i in entity.values) {
            var x = i.split(';');
            if (x.length !== 2) {
                continue;
            }
            var y = parseFloat(x[1]);
            x = parseFloat(x[0]);
            ctx.fillStyle = add ? entity.get(i) : '#ffffff';
            ctx.fillRect(cx + x, cy + y, 1, 1);
        }
    } else if (entity.get('type') === 'player') {
        player = entity;
    }
}

setInterval(function () {
    if (typeof player === 'undefined') {
        return;
    }
    var canvas = <HTMLCanvasElement>document.getElementById('canvas2');
    canvas.width = canvas.width;

    var context = canvas.getContext('2d');
    context.fillRect(player.get('x') - 1, player.get('y') - 1, 3, 3);
}, 16);

export = clientEvents;