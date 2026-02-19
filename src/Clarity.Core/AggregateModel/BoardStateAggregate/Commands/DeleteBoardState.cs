// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using Kernel;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Clarity.Core.AggregateModel.BoardStateAggregate.Commands;

public class DeleteBoardStateRequestValidator : AbstractValidator<DeleteBoardStateRequest> { }

public class DeleteBoardStateRequest : IRequest<DeleteBoardStateResponse>
{
    public Guid BoardStateId { get; set; }
}

public class DeleteBoardStateResponse : ResponseBase
{
    public BoardStateDto BoardState { get; set; }
}

public class DeleteBoardStateRequestHandler : IRequestHandler<DeleteBoardStateRequest, DeleteBoardStateResponse>
{
    private readonly ILogger<DeleteBoardStateRequestHandler> _logger;
    private readonly IClarityDbContext _context;

    public DeleteBoardStateRequestHandler(ILogger<DeleteBoardStateRequestHandler> logger, IClarityDbContext context)
    {
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<DeleteBoardStateResponse> Handle(DeleteBoardStateRequest request, CancellationToken cancellationToken)
    {
        var boardState = await _context.BoardStates
            .Include(x => x.TicketStates)
            .FirstOrDefaultAsync(x => x.BoardStateId == request.BoardStateId, cancellationToken);

        if (boardState == null)
        {
            return new() { Errors = { $"Board state with id {request.BoardStateId} not found." } };
        }

        var dto = boardState.ToDto();

        _context.BoardStates.Remove(boardState);

        await _context.SaveChangesAsync(cancellationToken);

        return new()
        {
            BoardState = dto
        };
    }
}
