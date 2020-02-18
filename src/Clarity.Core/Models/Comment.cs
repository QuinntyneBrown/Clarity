using System;

namespace Clarity.Core.Models
{
    public class Comment
    {
        public int CommentId { get; set; }
        public int TicketId { get; set; }
        public string Description { get; set; }
        public Ticket Ticket { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
    }
}
