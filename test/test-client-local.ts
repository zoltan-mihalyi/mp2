import server=require('./test-server');

import client=require('./test-client');

server.createUser(client('game', 'w', 'a', 's', 'd'));
server.createUser(client('game2', 'up', 'left', 'down', 'right'));