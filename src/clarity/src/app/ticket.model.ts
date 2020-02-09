import { State } from './state.model';

export class Ticket {
  public ticketId: string;
  public name: string;
  public currentState: State;
}
