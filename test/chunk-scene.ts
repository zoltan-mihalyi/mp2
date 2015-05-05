///<reference path="../typing/all.d.ts"/>
import Grape = require('grape-engine');
import Classes=require('./classes');

var ChunkScene = Classes.SimulatedScene.extend('ChunkScene', {
    init() {
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                this.createChunk(i * 16, j * 16);
            }
        }
    },

    createChunk(x, y) {
        var data = [];
        var chunk:Classes.Chunk = new Classes.Chunk({x: x, y: y, data: data});

        for (var i = 0; i < 16; i++) {
            var row = [];
            for (var j = 0; j < 16; j++) {
                row[j] = randomColor();
            }
            data[i] = row;
        }
        this.add(chunk);
    }
});


function randomColor() {
    return '#' + randomComponent() + randomComponent() + randomComponent();
}


function randomComponent() {
    var c = Math.floor(Math.random() * 256).toString(16);
    if (c.length === 1) {
        c = '0' + c;
    }
    return c;
}


export = ChunkScene;