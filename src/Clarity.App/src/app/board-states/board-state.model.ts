import { Ticket } from '../tickets';

export class BoardState {
  public boardStateId: number;
  public name: string;
  public type: number;
  public tickets: Ticket[] = [];
}
