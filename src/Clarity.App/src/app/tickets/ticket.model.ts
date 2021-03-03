export class Ticket {
  public ticketId: number;
  public name: string;
  public state: string;
  public age: number;
  public description: string;
  public acceptanceCriteria: string;
  public boardStateId: number;
  public boardId: number;
  public comments: Comment[] = [];
}
