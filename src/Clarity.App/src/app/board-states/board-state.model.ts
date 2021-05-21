import { Ticket } from '../tickets';

export type BoardState = {
  boardStateId: number;
  name: string;
  type: number;
  tickets: Ticket[];
}
