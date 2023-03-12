using System;

namespace Clarity.Core.AggregateModel;

public class CommentDto
{
    public Guid CommentId { get; set; }
    public Guid? TicketId { get; set; }
    public string Description { get; set; }
    public DateTime Created { get; set; }
    public Guid TeamMemberId { get; set; }
    public TeamMemberDto TeamMember { get; set; }
}
