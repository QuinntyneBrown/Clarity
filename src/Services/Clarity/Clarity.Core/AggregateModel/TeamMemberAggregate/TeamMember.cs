using System;
using System.Collections.Generic;
using Clarity.Core.AggregateModel.CommentAggregate;
using Clarity.Core.AggregateModel.TicketAggregate;

namespace Clarity.Core.AggregateModel.TeamMemberAggregate;

public class TeamMember
{
    public Guid TeamMemberId { get; private set; }
    public string Name { get; private set; }
    public string AvatarUrl { get; private set; }
    public List<Ticket> Tickets { get; private set; } = new();
    public List<Comment> Comments { get; private set; } = new();
    public TeamMember(string name)
    {
        Name = name;
    }
    public TeamMember()
    {
    }
}
