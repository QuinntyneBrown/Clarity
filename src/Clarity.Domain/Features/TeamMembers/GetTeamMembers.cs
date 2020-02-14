using Clarity.Core.Data;
using Clarity.Domain.Features.Extensions;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features.TeamMembers
{
    public class GetTeamMembers
    {
        public class Request : IRequest<Response> { }

        public class Response
        {
            public IEnumerable<TeamMemberDto> TeamMembers { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IClarityContext _context;
            
			public Handler(IClarityContext context) => _context = context;

            public Task<Response> Handle(Request request, CancellationToken cancellationToken)
                => Task.FromResult(new Response()
                {
                    TeamMembers = _context.TeamMembers
                    .Select(x => x.ToDto())
                    .ToList()
                });
        }
    }
}
