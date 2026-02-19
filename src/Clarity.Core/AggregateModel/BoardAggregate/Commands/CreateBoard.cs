// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.BoardStateAggregate;
using FluentValidation;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.BoardAggregate.Commands;

public class CreateBoardValidator : AbstractValidator<CreateBoardRequest>
{
    public CreateBoardValidator()
    {
        RuleFor(x => x.Name)
            .NotNull()
            .NotEmpty();
    }
}

public class CreateBoardRequest : IRequest<CreateBoardResponse>
{
    public string Name { get; set; }
    public List<string> States { get; set; }
}

public class CreateBoardResponse
{
    public BoardDto Board { get; set; }
}

public class CreateBoardRequestHandler : IRequestHandler<CreateBoardRequest, CreateBoardResponse>
{
    private readonly IClarityDbContext _context;

    public CreateBoardRequestHandler(IClarityDbContext context)
    {
        _context = context;
    }

    public async Task<CreateBoardResponse> Handle(CreateBoardRequest request, CancellationToken cancellationToken)
    {
        Board board;

        if (request.States != null && request.States.Count > 0)
        {
            board = Board.WithStates(request.Name, request.States);
        }
        else
        {
            board = Board.WithDefaults(request.Name);
        }

        _context.Boards.Add(board);

        await _context.SaveChangesAsync(cancellationToken);

        return new() { Board = board.ToDto() };
    }
}
