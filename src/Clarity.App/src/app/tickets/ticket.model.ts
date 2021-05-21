export type Ticket = {
  ticketId: number;
  name: string;
  state: string;
  age: number;
  description: string;
  acceptanceCriteria: string;
  boardStateId: number;
  boardId: number;
  comments: Comment[];
}
