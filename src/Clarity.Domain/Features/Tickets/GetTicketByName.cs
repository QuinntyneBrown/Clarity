using Clarity.Core.Data;
using Clarity.Domain.Features;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features
{
    public class GetTicketByName
    {
        public class Request : IRequest<Response> {
            public string Name { get; set; }
        }

        public class Response
        {
            public TicketDto Ticket { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IClarityContext _context;
            public Handler(IClarityContext context) => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
                => new Response
                {
                    Ticket = (await _context.Tickets
                    .Include(x => x.Comments)
                    .ThenInclude(x => x.TeamMember)
                    .Include(x=> x.TicketStates)
                    .ThenInclude(x => x.BoardState)
                    .FirstOrDefaultAsync(x => x.Name == request.Name))?.ToDto()
                };
        }
    }
}
