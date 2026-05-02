// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.TeamAggregate;

namespace Clarity.Core.AggregateModel;

public static class TeamExtensions
{
    public static TeamDto ToDto(this Team team)
        => new()
        {
            TeamId = team.TeamId,
            Name = team.Name,
            TeamMembers = (team.TeamMembers ?? new())
                .Select(x => x.ToDto())
                .ToList()
        };
}
