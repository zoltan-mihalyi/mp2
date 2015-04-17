///<reference path="..\src\game\game-state.ts"/>
function createChunks(state:GameState) {
    var chunks = [];

    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            createChunk(i * 16, j * 16);
        }
    }

    function createChunk(x, y) {
        var chunk = state.createEntity();
        chunk.set('type', 'chunk');
        chunk.set('x', x);
        chunk.set('y', y);

        chunks.push(chunk);

        for (var i = 0; i < 16; i++) {
            for (var j = 0; j < 16; j++) {
                chunk.set(i + ';' + j, randomColor());
            }
        }
    }

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

    return chunks;

}

export = createChunks;