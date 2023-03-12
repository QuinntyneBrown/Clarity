// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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

