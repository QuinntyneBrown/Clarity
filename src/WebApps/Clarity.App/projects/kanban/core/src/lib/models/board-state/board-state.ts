// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Ticket } from "../ticket";

export type BoardState = {
  boardStateId?: string;
  name: string;
  type: number;
  tickets: Ticket[];  
};