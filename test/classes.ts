///<reference path="../typing/all.d.ts"/>
///<reference path="..\src\id-provider.ts"/>

import Grape = require('grape-engine');
import classRegistry = require('./grape/class-registry');
var CELL_SIZE = 16;


export interface Position {
    x:number;
    y:number;
}

export interface Player extends Position {
    move(x:number, y:number):void;
}

export interface Chunk extends Position {
    data:string[][];
}

var Renderable = Grape.Class('Renderable', [Grape.Position, Grape.GameObject], {
    'abstract render': null
});

var BackgroundObject = Grape.Class('BackgroundObject', Renderable, {'abstract render': null});
var ForegroundObject = Grape.Class('ForegroundObject', Renderable, {'abstract render': null});

export var Player = Grape.Class('Player', [ForegroundObject], {
    init: function () {
        this.speed = 0.1;
    },
    move: function (x, y) {
        this.x += x * this.speed;
        this.y += y * this.speed;
    },
    render: function (ctx) {
        ctx.fillStyle = '#000';
        ctx.fillRect((this.x + 0.1) * CELL_SIZE, (this.y + 0.1) * CELL_SIZE, CELL_SIZE * 0.8, CELL_SIZE * 0.8);
    }
});

var KEY_DIRS = {
    left: [-1, 0],
    right: [1, 0],
    up: [0, -1],
    down: [0, 1]
};

function moveFn(scene, dir) {
    return ()=> {
        scene.mpGame.execute('move', dir[0], dir[1]);
    };
}

export var PlayerController = Grape.Class('PlayerController', [ForegroundObject], {
    init: function (opts) {
        opts = opts || {};
        this.player = opts.player;
    },
    render: function (ctx) {
        ctx.fillStyle = '#4f4';
        ctx.fillRect(this.player.x * CELL_SIZE, (this.player.y - 0.3) * CELL_SIZE, CELL_SIZE, 0.2 * CELL_SIZE);
    },
    'event add': function (scene) {
        var player = this.player;
        scene.mpGame.setPredicted('move', (x:number, y:number)=> {
            player.move(x, y);
        });
        for (var i in KEY_DIRS) {
            this.onGlobal('keyDown.' + scene.keys[i], moveFn(scene, KEY_DIRS[i]));
        }
    }
});

export var Chunk = Grape.Class('Chunk', [BackgroundObject], {
    init: function (opts) {
        opts = opts || {};
        this.data = opts.data;
    },
    render: function (ctx) {
        for (var i = 0; i < this.data.length; i++) {
            var row = this.data[i];
            for (var j = 0; j < this.data.length; j++) {
                ctx.fillStyle = row[j];
                ctx.fillRect((this.x + i) * CELL_SIZE, (this.y + j) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
});

export var RenderSystem = Grape.System.extend({
    'event render': function (ctx) {
        this.getLayer().get(BackgroundObject, true).forEach(function (renderable) {
            renderable.render(ctx);
        });
        this.getLayer().get(ForegroundObject, true).forEach(function (renderable) {
            renderable.render(ctx);
        });
    }
});

export var World = Grape.GameObject.extend();

classRegistry.register(Player);
classRegistry.register(PlayerController);
classRegistry.register(Chunk);
classRegistry.register(World);