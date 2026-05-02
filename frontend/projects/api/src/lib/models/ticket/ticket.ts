// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Comment } from '../comment';
import { DigitalAsset } from '../digital-asset';

export type Ticket = {
  ticketId: string;
  name: string;
  state: string;
  url: string;
  age: number;
  description: string;
  acceptanceCriteria: string;
  ticketType: number;
  storyPoints: number;
  effort: number;
  priority: number;
  boardStateId?: string;
  boardId: string;
  teamMemberId?: string;
  teamMemberName?: string;
  initiativeId?: string;
  initiativeName?: string;
  comments: Comment[];
  digitalAssets: DigitalAsset[];
};
