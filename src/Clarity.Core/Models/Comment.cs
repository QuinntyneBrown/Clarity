using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Clarity.Core.Models
{
    public class Comment
    {
        public int CommentId { get; set; }
        [ForeignKey("TeamMember")]
        public int TeamMemberId { get; set; }
        [ForeignKey("Ticket")]
        public int? TicketId { get; set; }
        public string Description { get; set; }
        public Ticket Ticket { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public TeamMember TeamMember { get; set; }
    }
}
