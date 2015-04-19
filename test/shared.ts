///<reference path="..\src\game\entity.ts"/>

export function move(player:Entity) {
    return function (x:number, y:number) {
        var x1 = player.get('x');
        var y1 = player.get('y');

        player.set('y', y + y1);
        player.set('x', x + x1);
    }
}