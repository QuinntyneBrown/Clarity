using Kernel;
using Clarity.Core;
using Clarity.Core.Models;
using Clarity.Core.ValueObjects;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
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
}
