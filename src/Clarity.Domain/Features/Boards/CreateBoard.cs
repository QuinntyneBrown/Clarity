using Clarity.Core;
using Clarity.Core.Data;
using Clarity.Core.Models;
using Clarity.Domain.Features.Boards;
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

            }
        }

        public class Request : IRequest<Response> {
            public int UserId { get; set; }
            public string Name { get; set; }
        }

        public class Response
        {
            public BoardDto Board { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IClarityContext _context;

            public Handler(IClarityContext context) {            
                _context = context;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken) {

                try
                {
                    var board = new Board
                    {
                        Name = request.Name,
                    };

                    var defaultStateNames = new string[3]
                    {
                        Constants.BoardStates.Backlog,
                        Constants.BoardStates.InProgress,
                        Constants.BoardStates.Done,
                    };

                    foreach (var state in defaultStateNames.Select(x => new State
                    {
                        Name = x
                    }).ToList())
                    {
                        board.States.Add(state);
                    };

                    _context.Boards.Add(board);

                    await _context.SaveChangesAsync(cancellationToken);

                    return new Response()
                    {
                        Board = board.ToDto()
                    };
                } catch(Exception e)
                {
                    throw e;
                }
            }
        }
    }
}
