// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.SprintAggregate;

namespace Clarity.Core.AggregateModel;

public static class SprintExtensions
{
    public static SprintDto ToDto(this Sprint sprint)
        => new()
        {
            SprintId = sprint.SprintId,
            Name = sprint.Name,
            Start = sprint.Start,
            End = sprint.End,
            TeamId = sprint.TeamId
        };
}
