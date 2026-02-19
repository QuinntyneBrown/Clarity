// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using Kernel;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Clarity.Core.AggregateModel.BoardAggregate.Commands;

public class DeleteBoardRequestValidator : AbstractValidator<DeleteBoardRequest> { }

public class DeleteBoardRequest : IRequest<DeleteBoardResponse>
{
    public Guid BoardId { get; set; }
}

public class DeleteBoardResponse : ResponseBase
{
    public BoardDto Board { get; set; }
}

public class DeleteBoardRequestHandler : IRequestHandler<DeleteBoardRequest, DeleteBoardResponse>
{
    private readonly ILogger<DeleteBoardRequestHandler> _logger;
    private readonly IClarityDbContext _context;

    public DeleteBoardRequestHandler(ILogger<DeleteBoardRequestHandler> logger, IClarityDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<DeleteBoardResponse> Handle(DeleteBoardRequest request, CancellationToken cancellationToken)
    {
        var board = await _context.Boards
            .Include(x => x.BoardStates)
            .FirstOrDefaultAsync(x => x.BoardId == request.BoardId, cancellationToken);

        if (board == null)
        {
            return new() { Errors = { $"Board with id {request.BoardId} not found." } };
        }

        var dto = board.ToDto();

        _context.BoardStates.RemoveRange(board.BoardStates);

        _context.Boards.Remove(board);

        await _context.SaveChangesAsync(cancellationToken);

        return new()
        {
            Board = dto
        };
    }
}
