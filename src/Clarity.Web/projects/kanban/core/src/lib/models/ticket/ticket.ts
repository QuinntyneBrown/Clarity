// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Comment } from '../comment';

export type Ticket = {
  ticketId: string;
  name: string;
  state: string;
  age: number;
  description: string;
  acceptanceCriteria: string;
  boardStateId?: string;
  boardId: string;
  comments: Comment[];
};


