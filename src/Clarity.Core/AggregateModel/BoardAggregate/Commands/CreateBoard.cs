// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using FluentValidation;
using MediatR;
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
        var board = Board.WithDefaults(request.Name);

        _context.Boards.Add(board);

        await _context.SaveChangesAsync(cancellationToken);

        return new() { Board = board.ToDto() };
    }
}

