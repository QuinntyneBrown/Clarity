// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Clarity.Core.AggregateModel;

public class TeamDto
{
    public Guid TeamId { get; set; }
    public string Name { get; set; }
    public List<TeamMemberDto> TeamMembers { get; set; } = new();
}
