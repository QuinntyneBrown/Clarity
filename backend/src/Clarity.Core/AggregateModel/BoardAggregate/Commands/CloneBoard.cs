// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.BoardAggregate.Commands;

public class CloneBoardValidator : AbstractValidator<CloneBoardRequest>
{
    public CloneBoardValidator()
    {
        RuleFor(x => x.BoardId)
            .NotEmpty();

        RuleFor(x => x.Name)
            .NotNull()
            .NotEmpty();
    }
}

public class CloneBoardRequest : IRequest<CloneBoardResponse>
{
    public Guid BoardId { get; set; }
    public string Name { get; set; }
}

public class CloneBoardResponse
{
    public BoardDto Board { get; set; }
}

public class CloneBoardRequestHandler : IRequestHandler<CloneBoardRequest, CloneBoardResponse>
{
    private readonly IClarityDbContext _context;

    public CloneBoardRequestHandler(IClarityDbContext context)
    {
        _context = context;
    }

    public async Task<CloneBoardResponse> Handle(CloneBoardRequest request, CancellationToken cancellationToken)
    {
        var sourceBoard = await _context.Boards
            .Include(x => x.BoardStates)
            .FirstOrDefaultAsync(x => x.BoardId == request.BoardId, cancellationToken);

        if (sourceBoard == null)
            throw new Exception($"Board with id {request.BoardId} not found.");

        var clonedBoard = Board.WithDefaults(request.Name);

        _context.Boards.Add(clonedBoard);

        await _context.SaveChangesAsync(cancellationToken);

        return new() { Board = clonedBoard.ToDto() };
    }
}
