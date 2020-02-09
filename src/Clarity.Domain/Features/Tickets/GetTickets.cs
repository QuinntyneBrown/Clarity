using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

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
            public Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                throw new System.NotImplementedException();
            }
        }
    }
}
