using Clarity.Core.AggregateModel.CommentAggregate;

namespace Clarity.Core.AggregateModel;

public static class CommentExtensions
{
    public static CommentDto ToDto(this Comment comment)
        => new()
        {
            CommentId = comment.CommentId,
            Description = comment.Description,
            Created = comment.Created,
            TicketId = comment.TicketId,
            TeamMemberId = comment.TeamMemberId
        };
}
