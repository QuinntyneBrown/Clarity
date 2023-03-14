// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject } from "@angular/core";
import { map,of } from "rxjs";
import { BoardService } from "../../models";

export function createKanbanViewModel() {

  const boardService = inject(BoardService);
  
  const name = "Default";

  return boardService.getByName({ name }).pipe(
    map(board => {
      return { 
        board
      };
    })
  );
};


