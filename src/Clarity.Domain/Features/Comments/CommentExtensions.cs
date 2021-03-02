using Clarity.Core.Models;
using Clarity.Domain.Features.Comments;

namespace Clarity.Domain.Features
{
    public static class CommentExtensions
    {
        public static CommentDto ToDto(this Comment comment)
            => new CommentDto
            {
                CommentId = comment.CommentId,
                Description = comment.Description,
                Created = comment.Created,
                TicketId = comment.TicketId,
                TeamMemberId = comment.TeamMemberId
            };
    }
}
