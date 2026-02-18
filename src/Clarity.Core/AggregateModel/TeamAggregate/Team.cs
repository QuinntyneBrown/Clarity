// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.TeamMemberAggregate;

namespace Clarity.Core.AggregateModel.TeamAggregate;

public class Team
{
    public Guid TeamId { get; private set; }
    public string Name { get; private set; }
    public List<TeamMember> TeamMembers { get; private set; } = new();

    public Team(string name)
    {
        Name = name;
    }

    private Team() { }

    public void Update(string name)
    {
        Name = name;
    }
}
