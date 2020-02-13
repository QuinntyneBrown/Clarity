using Clarity.Core.Data;
using Clarity.Core.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features.Tickets
{
    public class UpsertTicket
    {
        public class Request: IRequest<Response>
        {
            public TicketDto Ticket { get; set; }
        }

        public class Response { }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IClarityContext _context;
            public Handler(IClarityContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var state = _context.States.First(x => x.Name == request.Ticket.State);
                var ticket = await _context.Tickets.FirstOrDefaultAsync(x => x.Name == request.Ticket.Name);

                if (ticket == null)
                {
                    ticket = new Ticket { Name = request.Ticket.Name, Url = ticket.Url };
                    _context.Tickets.Add(ticket);
                }

                ticket.TicketStates.Clear();

                ticket.TicketStates.Add(new TicketState { State = state });

                await _context.SaveChangesAsync(cancellationToken);

                return new Response { };
            }
        }
    }
}
