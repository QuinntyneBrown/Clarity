import { Ticket } from '../tickets';

export class State {
  public stateId: number;
  public name: string;
  public tickets: Ticket[] = [];
}
