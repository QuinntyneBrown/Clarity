// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { inject } from "@angular/core";
import { map,of } from "rxjs";

export function createCreateCommentViewModel() {
  return of("create-comment works!").pipe(
    map(message => ({ message }))
  );
};


