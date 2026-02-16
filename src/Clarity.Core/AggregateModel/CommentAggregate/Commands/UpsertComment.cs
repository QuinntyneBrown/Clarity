// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.ValueObjects;
using Kernel;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.CommentAggregate.Commands;

public class UpsertCommentRequest : IRequest<UpsertCommentResponse>
{
    public CommentDto Comment { get; set; }
}

public class UpsertCommentResponse : ResponseBase
{
    public Guid CommentId { get; set; }
}

public class UpsertCommentHandler : IRequestHandler<UpsertCommentRequest, UpsertCommentResponse>
{
    public IClarityDbContext _context { get; set; }
    public UpsertCommentHandler(IClarityDbContext context) => _context = context;

    public async Task<UpsertCommentResponse> Handle(UpsertCommentRequest request, CancellationToken cancellationToken)
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

