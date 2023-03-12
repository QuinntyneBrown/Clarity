using Clarity.Core.AggregateModel.BoardAggregate;
using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.BoardAggregate.Commands;

public class CreateBoard
{
    public class Validator : AbstractValidator<Request>
    {
        public Validator()
        {
            RuleFor(x => x.Name)
                .NotNull()
                .NotEmpty();
        }
    }

    public class Request : IRequest<Response>
    {
        public string Name { get; set; }
    }

    public class Response
    {
        public BoardDto Board { get; set; }
    }

    public class Handler : IRequestHandler<Request, Response>
    {
        private readonly IClarityDbContext _context;

        public Handler(IClarityDbContext context)
        {
            _context = context;
        }

        public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
        {

            var board = Board.WithDefaults(request.Name);

            _context.Boards.Add(board);

            await _context.SaveChangesAsync(cancellationToken);

            return new() { Board = board.ToDto() };
        }
    }
}