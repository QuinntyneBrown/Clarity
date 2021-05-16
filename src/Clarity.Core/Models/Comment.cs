using Clarity.Core.ValueObjects;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Clarity.Core.Models
{
    public class Comment
    {
        public int CommentId { get; private set; }
        [ForeignKey("TeamMember")]
        public int TeamMemberId { get; private set; }
        [ForeignKey("Ticket")]
        public int? TicketId { get; private set; }
        public Html Description { get; private set; }
        public Ticket Ticket { get; private set; }
        public DateTime Created { get; private set; } = DateTime.UtcNow;
        public TeamMember TeamMember { get; private set; }

        public Comment(Html description, int ticketId)
        {
            Description = description;
            TicketId = ticketId;
        }

        public void Update(Html description, int ticketId)
        {
            Description = description;
            TicketId = ticketId;
        }

        private Comment()
        {

        }
    }
}
