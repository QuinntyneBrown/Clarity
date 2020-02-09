using Clarity.Core.Data;
using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features.States
{
    public class GetStates
    {
        public class Request : IRequest<Response> { 
        
        }

        public class Response
        {
            public IEnumerable<StateDto> States { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IClarityContext _context;

            public Handler(IClarityContext context)
            {
                _context = context;
            }

            public Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                throw new System.NotImplementedException();
            }
        }
    }
}
