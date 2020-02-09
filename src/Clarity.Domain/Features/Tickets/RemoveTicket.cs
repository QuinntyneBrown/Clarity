using MediatR;
using System;
using System.Threading.Tasks;
using System.Threading;

namespace Clarity.Domain.Features.Tickets
{
    public class RemoveTicket
    {
        public class Request : IRequest
        {
            public int TicketId { get; set; }
        }

        public class Handler : IRequestHandler<Request>
        {
            public Task<Unit> Handle(Request request, CancellationToken cancellationToken)
            {
                throw new NotImplementedException();
            }
        }
    }
}
