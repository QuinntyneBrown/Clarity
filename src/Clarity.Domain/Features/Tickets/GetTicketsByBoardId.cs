using Clarity.Core.Data;
using Clarity.Domain.Features;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features
{
    public class GetTicketsByBoardId
    {
        public class Request : IRequest<Response> {
            public int BoardId { get; set; }
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
                => new Response
                {
                    Tickets = await _context.Tickets
                    .Include(x => x.Comments)
                    .Include(x => x.TicketStates)
                    .ThenInclude(x => x.BoardState)
                    .Where(x => x.TicketStates.OrderByDescending(ts => ts.Created).First().BoardState.BoardId == request.BoardId)
                    .Select(x => x.ToDto())
                    .ToListAsync()
                };
        }
    }
}
