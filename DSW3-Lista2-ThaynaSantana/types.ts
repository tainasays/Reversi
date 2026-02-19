export type Player = 'B' | 'W';
export type Cell = Player | null;
export type Board = Cell[][];

export interface Move {
  row: number;
  col: number;
  player: Player;
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  validMoves: { row: number; col: number }[];
}
