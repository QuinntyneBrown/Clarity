using Clarity.Core.AggregateModel.CommentAggregate;
using Clarity.Core.AggregateModel.TeamMemberAggregate;
using Clarity.Core.DomainEvents;
using Clarity.Core.ValueObjects;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Clarity.Core.AggregateModel.TicketAggregate;

public class Ticket
 {
    public Guid TicketId { get; private set; }

    [ForeignKey("TeamMember")]
    public Guid TeamMemberId { get; private set; }
    public string Name { get; private set; }
    public string Url { get; private set; }
    public Html Description { get; private set; }
    public Html AcceptanceCriteria { get; private set; }
    public int StoryPoints { get; private set; }
    public int Effort { get; private set; }
    public int Priority { get; private set; }
    public TicketType TicketType { get; set; }
    public TeamMember TeamMember { get; private set; }
    public List<TicketState> TicketStates { get; private set; } = new();
    public TicketState CurrentTicketState { get => TicketStates.OrderByDescending(x => x.Created).First(); }
    public List<Comment> Comments { get; private set; } = new();
    public List<TicketEffortChanged> EffortChangedEvents { get; private set; } = new();
    public Ticket(Guid teamMemberId, string name, string url, Html acceptanceCriteria, Html description)
    {
        TeamMemberId = teamMemberId;
        Name = name;
        Url = url;
        AcceptanceCriteria = acceptanceCriteria;
        Description = description;
        TicketType = TicketType.Chore;
    }
    private Ticket()
    {
        TicketType = TicketType.Chore;
    }

    public void Update(Guid teamMemberId, string name, string url, Html acceptanceCriteria, Html description)
    {
        TeamMemberId = teamMemberId;
        Name = name;
        Url = url;
        AcceptanceCriteria = acceptanceCriteria;
        Description = description;
    }
    public void UpdateEffort(int effort)
    {
        Effort = effort;
        EffortChangedEvents.Add(new(effort, DateTime.UtcNow));
    }
 }
