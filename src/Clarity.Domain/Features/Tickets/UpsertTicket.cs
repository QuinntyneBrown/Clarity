using Clarity.Core.Data;
using Clarity.Core.Models;
using MediatR;
using System.Collections.Generic;
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

        public class Response
        {

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
                var state = _context.States.First(x => x.Name == request.Ticket.State);

                _context.Tickets.Add(new Ticket
                {
                    Name = request.Ticket.Name,
                    TicketStates = new List<TicketState> { new TicketState { State = state } }
                });

                await _context.SaveChangesAsync(cancellationToken);

                return new Response { };
            }
        }
    }
}
