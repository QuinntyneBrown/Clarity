// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export type Initiative = {
  initiativeId?: string;
  name?: string;
  description?: string;
  created?: string;
  ticketCount?: number;
};

export type InitiativeReport = {
  initiativeId?: string;
  name?: string;
  description?: string;
  created?: string;
  totalTickets?: number;
  backlogTickets?: number;
  inProgressTickets?: number;
  doneTickets?: number;
  totalEffort?: number;
  totalStoryPoints?: number;
  percentComplete?: number;
};
