import { BoardState } from '../board-states';

export type Board = {
  boardId: number;
  name: string;
  states: Array<BoardState>;
}
