import { Ticket } from '../tickets';

export class State {
  public stateId: string;
  public name: string;
  public tickets: Ticket[] = [];
}
