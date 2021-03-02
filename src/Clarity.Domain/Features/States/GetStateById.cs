using Clarity.Core.Data;
using Clarity.Domain.Features;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features.States
{
    public class GetStateById
    {
        public class Request : IRequest<Response> {
            public int StateId { get; set; }
        }

        public class Response
        {
            public StateDto State { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IClarityContext _context;

            public Handler(IClarityContext context)
                => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
                => new Response
                {
                    State = (await _context.States.FindAsync(request.StateId)).ToDto()
                };
        }
    }
}
