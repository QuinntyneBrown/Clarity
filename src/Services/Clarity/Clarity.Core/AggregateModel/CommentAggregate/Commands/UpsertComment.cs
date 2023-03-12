using Clarity.Core.AggregateModel.CommentAggregate;
using Clarity.Core.ValueObjects;
using Kernel;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.CommentAggregate.Commands;

public class UpsertComment
{
    public class Request : IRequest<Response>
    {
        public CommentDto Comment { get; set; }
    }

    public class Response : ResponseBase
    {
        public Guid CommentId { get; set; }
    }

    public class Handler : IRequestHandler<Request, Response>
    {
        public IClarityDbContext _context { get; set; }
        public Handler(IClarityDbContext context) => _context = context;

        public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
        {
            var comment = await _context.Comments.FirstOrDefaultAsync(x => x.CommentId == request.Comment.CommentId);

            if (comment == null)
            {
                comment = new Comment((Html)request.Comment.Description, request.Comment.TicketId.Value);
                _context.Comments.Add(comment);
            }
            else
            {
                comment.Update((Html)request.Comment.Description, request.Comment.TicketId.Value);
            }

            await _context.SaveChangesAsync(cancellationToken);

            return new()
            {
                CommentId = comment.CommentId
            };
        }
    }
}
