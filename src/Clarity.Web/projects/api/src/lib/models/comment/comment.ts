// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TeamMember } from '../team-member';

export type Comment = {
  commentId?: string;
  ticketId: string;
  teamMemberId: string;
  description: string;
  created: Date;
  teamMember?: TeamMember;
};
