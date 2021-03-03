import { BoardState } from '../board-states';

export class Board {
  public boardId: number;
  public name: string;
  public states: Array<BoardState> = [];
}
