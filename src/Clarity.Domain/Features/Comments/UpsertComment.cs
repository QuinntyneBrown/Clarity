using BuildingBlocks.Core;
using Clarity.Core.Data;
using Clarity.Core.Models;
using Clarity.Core.ValueObjects;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features
{
    public class UpsertComment
    {
        public class Request : IRequest<Response>
        {
            public CommentDto Comment { get; set; }
        }

        public class Response : ResponseBase
        {
            public int CommentId { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            public IClarityContext _context { get; set; }
            public Handler(IClarityContext context) => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var comment = await _context.Comments.FirstOrDefaultAsync(x => x.CommentId == request.Comment.CommentId);

                if (comment == null)
                {
                    comment = new Comment();
                    _context.Comments.Add(comment);
                }

                comment.Description = (Html)request.Comment.Description;
                comment.TicketId = request.Comment.TicketId;

                await _context.SaveChangesAsync(cancellationToken);

                return new Response()
                {
                    CommentId = comment.CommentId
                };
            }
        }
    }
}
