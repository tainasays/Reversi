import { WebSocketServer } from 'ws';
import { Reversi } from './reversi';
import { Move } from './types';

const wss = new WebSocketServer({ port: 8080 });
const game = new Reversi();
let players: { id: string; ws: any }[] = [];

wss.on('connection', ws => {
  if (players.length < 2) {
    const playerId = Math.random().toString();
    players.push({ id: playerId, ws });
    ws.send(JSON.stringify({ type: 'assign', player: players.length === 1 ? 'B' : 'W' }));
  }
  ws.send(JSON.stringify({ type: 'state', state: game.getState() }));

  ws.on('message', msg => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.type === 'move') {
        const move: Move = data.move;
        if (game.currentPlayer === move.player && game.makeMove(move)) {
          wss.clients.forEach(client => {
            client.send(JSON.stringify({ type: 'state', state: game.getState() }));
          });
        } //else {
          //ws.send(JSON.stringify({ type: 'error', message: 'Jogada inválida.' }));
       // }
      }
    } catch (e) {
      ws.send(JSON.stringify({ type: 'error', message: 'Erro de mensagem.' }));
    }
  });
});

console.log('Servidor Reversi rodando na porta 8080');
