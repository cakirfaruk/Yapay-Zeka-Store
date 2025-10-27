import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: process.env.PORT || 4000 });

wss.on('connection', (socket) => {
  socket.send(JSON.stringify({ type: 'hello', message: 'Gateway hazır' }));
});

console.log('Gateway WS listening on', process.env.PORT || 4000);
