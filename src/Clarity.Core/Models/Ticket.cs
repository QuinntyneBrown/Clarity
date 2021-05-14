using Clarity.Core.DomainEvents;
using Clarity.Core.ValueObjects;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Clarity.Core.Models
{
    public class Ticket
    {
        public int TicketId { get; private set; }

        [ForeignKey("TeamMember")]
        public int TeamMemberId { get; private set; }
        public string Name { get; private set; }
        public string Url { get; private set; }
        public Html Description { get; private set; }
        public Html AcceptanceCriteria { get; private set; }
        public int StoryPoints { get; private set; }
        public int Effort { get; private set; }
        public int Priority { get; private set; }
        public TeamMember TeamMember { get; private set; }
        public ICollection<TicketState> TicketStates { get; private set; } = new HashSet<TicketState>();
        public TicketState CurrentTicketState { get => TicketStates.OrderByDescending(x => x.Created).First(); }
        public ICollection<Comment> Comments { get; private set; } = new HashSet<Comment>();
        public List<TicketEffortChanged> EffortChangedEvents { get; private set; } = new();

        public Ticket(int teamMemberId, string name, string url, Html acceptanceCriteria, Html description)
        {
            TeamMemberId = teamMemberId;
            Name = name;
            Url = url;
            AcceptanceCriteria = acceptanceCriteria;
            Description = description;
        }

        private Ticket()
        {

        }

        public void Update(int teamMemberId, string name, string url, Html acceptanceCriteria, Html description)
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
}
