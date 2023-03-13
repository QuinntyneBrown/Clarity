// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject } from "@angular/core";
import { map,of } from "rxjs";

export function createSelectBoardViewModel() {
  return of("select-board works!").pipe(
    map(message => ({ message }))
  );
};


