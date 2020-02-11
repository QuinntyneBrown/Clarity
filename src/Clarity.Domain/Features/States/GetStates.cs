using Clarity.Core.Data;
using Clarity.Domain.Features.Extensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features.States
{
    public class GetStates
    {
        public class Request : IRequest<Response> { }

        public class Response
        {
            public IEnumerable<StateDto> States { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IClarityContext _context;

            public Handler(IClarityContext context) => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
                => new Response
                {
                    States = await _context.States.Select(x => x.ToDto()).ToListAsync()
                };
        }
    }
}
