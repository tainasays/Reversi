import { Player, Cell, Board, Move, GameState } from './types';

export class Reversi {
  board: Board;
  currentPlayer: Player;

  constructor() {
    this.board = this.createBoard();
    this.currentPlayer = 'B';
  }

  createBoard(): Board {
    const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
    board[3]![3] = 'B';
    board[3]![4] = 'W';
    board[4]![3] = 'W';
    board[4]![4] = 'B';
    return board;
  }

  getValidMoves(player: Player): { row: number; col: number }[] {
    const moves: { row: number; col: number }[] = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (this.board[row]![col] === null && this.canPlace(row, col, player)) {
          moves.push({ row, col });
        }
      }
    }
    return moves;
  }

  canPlace(row: number, col: number, player: Player): boolean {
    return this.getFlips(row, col, player).length > 0;
  }

  getFlips(row: number, col: number, player: Player): [number, number][] {
    const directions: [number, number][] = [
      [0, 1], [1, 0], [0, -1], [-1, 0],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];
    const opponent: Player = player === 'B' ? 'W' : 'B';
    const flips: [number, number][] = [];
    for (const [dr, dc] of directions) {
      let r = row + dr;
      let c = col + dc;
      let line: [number, number][] = [];
      while (r >= 0 && r < 8 && c >= 0 && c < 8 && this.board[r]![c] === opponent) {
        line.push([r, c]);
        r += dr;
        c += dc;
      }
      if (line.length > 0 && r >= 0 && r < 8 && c >= 0 && c < 8 && this.board[r]![c] === player) {
        flips.push(...line);
      }
    }
    return flips;
  }

  makeMove(move: Move): boolean {
    if (!this.canPlace(move.row, move.col, move.player)) return false;
    const flips = this.getFlips(move.row, move.col, move.player);
    this.board[move.row]![move.col] = move.player;
    for (const [r, c] of flips) {
      this.board[r]![c] = move.player;
    }
   
    const nextPlayer = move.player === 'B' ? 'W' : 'B';
    if (this.getValidMoves(nextPlayer).length > 0) {
      this.currentPlayer = nextPlayer;
    } else if (this.getValidMoves(move.player).length > 0) {
      
      this.currentPlayer = move.player;
    } else {
    
      this.currentPlayer = nextPlayer; 
    }
    return true;
  }

  getWinner(): Player | 'draw' | null {
    const flat = this.board.flat();
    const b = flat.filter(cell => cell === 'B').length;
    const w = flat.filter(cell => cell === 'W').length;
    if (this.getValidMoves('B').length === 0 && this.getValidMoves('W').length === 0) {
      if (b > w) return 'B';
      if (w > b) return 'W';
      return 'draw';
    }
    return null;
  }

  getState(): GameState {
    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
      winner: this.getWinner(),
      validMoves: this.getValidMoves(this.currentPlayer)
    };
  }
}
