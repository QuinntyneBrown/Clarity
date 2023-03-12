using Clarity.Core.AggregateModel.TeamMemberAggregate;
using Clarity.Core.AggregateModel.TicketAggregate;
using Clarity.Core.ValueObjects;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Clarity.Core.AggregateModel.CommentAggregate
{
    public class Comment
    {
        public Guid CommentId { get; private set; }
        [ForeignKey("TeamMember")]
        public Guid TeamMemberId { get; private set; }
        [ForeignKey("Ticket")]
        public Guid? TicketId { get; private set; }
        public Html Description { get; private set; }
        public Ticket Ticket { get; private set; }
        public DateTime Created { get; private set; } = DateTime.UtcNow;
        public TeamMember TeamMember { get; private set; }

        public Comment(Html description, Guid ticketId)
        {
            Description = description;
            TicketId = ticketId;
        }

        public void Update(Html description, Guid ticketId)
        {
            Description = description;
            TicketId = ticketId;
        }

        private Comment()
        {

        }
    }
}
