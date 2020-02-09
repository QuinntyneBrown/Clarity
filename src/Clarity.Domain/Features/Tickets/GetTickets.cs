using Clarity.Core.Data;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Clarity.Domain.Features.Extensions;

namespace Clarity.Domain.Features.Tickets
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
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                return await Task.FromResult(new Response
                {
                    Tickets = _context.Tickets.Select(x => x.ToDto()).ToList()
                });
            }
        }
    }
}
