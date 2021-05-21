using Clarity.Core.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features
{
    public class GetTicketsByBoardName
    {
        public class Request : IRequest<Response>
        {
            public string Name { get; set; }
        }

        public class Response
        {
            public IEnumerable<TicketDto> Tickets { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            public IClarityContext _context { get; set; }
            public Handler(IClarityContext context) => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
                => new()
            {
                Tickets = await _context.Tickets
                    .Include(x => x.Comments)
                    .Include(x => x.TicketStates)
                    .ThenInclude(x => x.BoardState)
                    .ThenInclude(x => x.Board)
                    .Where(x => x.TicketStates.OrderByDescending(ts => ts.Created).First().BoardState.Board.Name == request.Name)
                    .Select(x => x.ToDto())
                    .ToListAsync()
            };
        }
    }
}
