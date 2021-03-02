using Clarity.Domain.Features;
using System;

namespace Clarity.Domain.Features
{
    public class CommentDto
    {
        public int CommentId { get; set; }
        public int? TicketId { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; }
        public int TeamMemberId { get; set; }
        public TeamMemberDto TeamMember { get; set; }
    }
}