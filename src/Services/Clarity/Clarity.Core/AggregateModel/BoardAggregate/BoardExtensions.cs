// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.BoardAggregate;
using System.Linq;

namespace Clarity.Core.AggregateModel;

public static class BoardExtensions
{
    public static BoardDto ToDto(this Board board)
        => new()
        {
            BoardId = board.BoardId,
            Name = board.Name,
            States = board.BoardStates
            .OrderBy(x => x.Order)
            .Select(x => x.ToDto())
            .ToList()
        };
}

