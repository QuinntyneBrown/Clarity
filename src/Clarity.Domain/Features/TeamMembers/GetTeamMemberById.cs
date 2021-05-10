using Clarity.Core.Data;
using Clarity.Domain.Features;
using MediatR;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features
{
    public class GetTeamMemberById
    {
        public class Request : IRequest<Response>
        {
            public int TeamMemberId { get; set; }
        }

        public class Response
        {
            public TeamMemberDto TeamMember { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IClarityContext _context;

            public Handler(IClarityContext context) => _context = context;

            public Task<Response> Handle(Request request, CancellationToken cancellationToken)
                 => Task.FromResult(new Response()
                 {
                     TeamMember = _context.TeamMembers.First(x => x.TeamMemberId == request.TeamMemberId).ToDto()
                 });
        }
    }
}
