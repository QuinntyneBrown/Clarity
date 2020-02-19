using Clarity.Core.Data;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features.Tickets
{
    public class RemoveTicket
    {
        public class Request : IRequest<Response> {
            public int TicketId { get; set; }
        }

        public class Response { }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IClarityContext _context;
            public Handler(IClarityContext context) => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken) {
                var ticket = await _context.Tickets.FindAsync(request.TicketId);

                _context.Tickets.Remove(ticket);

                await _context.SaveChangesAsync(cancellationToken);

			    return new Response() { 
                
                };
            }
        }
    }
}
