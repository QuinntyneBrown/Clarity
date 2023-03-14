// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { BoardState } from "../board-state";

export type Board = {
  boardId?: string;
  name: string;
  states: Array<BoardState>;  
};


