// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.BoardStateAggregate;

namespace Clarity.Core.AggregateModel;

public static class BoardStateExtensions
{
    public static BoardStateDto ToDto(this BoardState boardState)
        => new()
        {
            BoardStateId = boardState.BoardStateId,
            Name = boardState.Type.ToString(),
            Order = boardState.Order,
            Type = boardState.Type
        };
}

