using Clarity.Core.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features
{
    public class GetTickets
    {
        public class Request : IRequest<Response> { }

        public class Response
        {
            public IEnumerable<TicketDto> Tickets { get; set; }
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
                return new ()
                {
                    Tickets = await _context.Tickets
                    .Include(x => x.TicketStates)
                    .ThenInclude(x => x.BoardState)
                    .Select(x => x.ToDto())
                    .ToListAsync()
                };
            }
        }
    }
}
