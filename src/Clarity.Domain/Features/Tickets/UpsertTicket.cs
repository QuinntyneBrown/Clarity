using Clarity.Core.Data;
using Clarity.Core.Models;
using MediatR;
using Microsoft.EntityFrameworkCore;
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
                
                var state = await _context.States.FindAsync(request.Ticket.StateId);

                var ticket = await _context.Tickets
                    .Include(x => x.TicketStates)
                    .ThenInclude(x => x.State)
                    .FirstOrDefaultAsync(x => x.TicketId == request.Ticket.TicketId);

                if (ticket == null)
                {
                    ticket = new Ticket { };
                    _context.Tickets.Add(ticket);
                }

                //TODO: Implement authentication and team members
                ticket.TeamMemberId = 1;
                ticket.Name = request.Ticket.Name;
                ticket.Url = request.Ticket.Url;
                ticket.AcceptanceCriteria = request.Ticket.AcceptanceCriteria;
                ticket.Description = request.Ticket.Description;

                ticket.TicketStates.Clear();

                ticket.TicketStates.Add(new TicketState { State = state });

                await _context.SaveChangesAsync(cancellationToken);

                return new Response { };
            }
        }
    }
}
