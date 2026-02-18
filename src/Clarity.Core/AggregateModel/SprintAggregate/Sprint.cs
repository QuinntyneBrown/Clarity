// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.TeamAggregate;

namespace Clarity.Core.AggregateModel.SprintAggregate;

public class Sprint
{
    public Guid SprintId { get; private set; }
    public string Name { get; private set; }
    public DateTime Start { get; private set; }
    public DateTime End { get; private set; }

    public Guid TeamId { get; private set; }
    public Team Team { get; private set; }

    public Sprint(string name, DateTime start, DateTime end, Guid teamId)
    {
        Name = name;
        Start = start;
        End = end;
        TeamId = teamId;
    }

    private Sprint() { }

    public void Update(string name, DateTime start, DateTime end, Guid teamId)
    {
        Name = name;
        Start = start;
        End = end;
        TeamId = teamId;
    }
}
