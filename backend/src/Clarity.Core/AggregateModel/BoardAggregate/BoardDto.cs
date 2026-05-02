// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using System.Collections.Generic;

namespace Clarity.Core.AggregateModel;

public class BoardDto
{
    public Guid BoardId { get; set; }
    public string Name { get; set; }
    public List<BoardStateDto> States { get; set; } = new();
}

