using Clarity.Core;
using Clarity.Core.Data;
using Clarity.Core.Models;
using Clarity.Domain.Features;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features
{
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
            private readonly IClarityContext _context;

            public Handler(IClarityContext context)
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
}
