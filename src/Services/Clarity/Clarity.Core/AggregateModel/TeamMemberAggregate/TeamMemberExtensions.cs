// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.TeamMemberAggregate;

namespace Clarity.Core.AggregateModel;

public static class TeamMemberExtensions
{
    public static TeamMemberDto ToDto(this TeamMember teamMember)
        => new()
        {
            TeamMemberId = teamMember.TeamMemberId,
            Name = teamMember.Name
        };
}

