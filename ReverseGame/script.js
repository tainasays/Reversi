let ws;
let player = null;
let currentPlayer = null;
let board = [];
let validMoves = [];
let winner = null;

function connect() {
  ws = new WebSocket('ws://localhost:8080');
  ws.onopen = () => setStatus('Conectado! Aguardando outro jogador...');
  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.type === 'assign') {
      player = msg.player;
      setStatus('Você é o jogador ' + (player === 'B' ? 'Preto' : 'Branco'));
    }
    if (msg.type === 'state') {
      board = msg.state.board;
      currentPlayer = msg.state.currentPlayer;
      validMoves = msg.state.validMoves;
      winner = msg.state.winner;
      render();
    }
    if (msg.type === 'error') {
      alert(msg.message);
    }
  };
  ws.onclose = () => setStatus('Desconectado do servidor. Recarregue a página.');
}

function setStatus(text) {
  document.getElementById('status').textContent = text;
}

function render() {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (validMoves.some(m => m.row === row && m.col === col) && player === currentPlayer && !winner) {
        cell.classList.add('valid');
        cell.onclick = () => sendMove(row, col);
      }
      if (board[row][col]) {
        const piece = document.createElement('div');
        piece.className = 'piece ' + board[row][col];
        cell.appendChild(piece);
      }
      boardDiv.appendChild(cell);
    }
  }
  if (winner) {
    if (winner === 'draw') setStatus('Empate!');
    else setStatus('Vencedor: ' + (winner === 'B' ? 'Preto' : 'Branco'));
  } else if (player === currentPlayer) {
    setStatus('Sua vez! (' + (player === 'B' ? 'Preto' : 'Branco') + ')');
  } else {
    setStatus('Aguardando oponente...');
  }
}

function sendMove(row, col) {
  if (ws && player && player === currentPlayer) {
    ws.send(JSON.stringify({ type: 'move', move: { row, col, player } }));
  }
}

connect();
