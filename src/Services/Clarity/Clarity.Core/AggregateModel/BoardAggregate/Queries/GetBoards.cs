using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.BoardAggregate.Queries
{
    public class GetBoards
    {
        public class Request : IRequest<Response> { }

        public class Response
        {
            public ICollection<BoardDto> Boards { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            public IClarityDbContext _context { get; set; }
            public Handler(IClarityDbContext context) => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
                => new()
                {
                    Boards = await _context.Boards
                    .Include(x => x.BoardStates)
                    .Select(x => x.ToDto())
                    .ToListAsync()
                };
        }
    }
}
