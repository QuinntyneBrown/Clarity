using Clarity.Core.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
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

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                return new ()
                {
                    TeamMember = (await _context.TeamMembers.FirstOrDefaultAsync(x => x.TeamMemberId == request.TeamMemberId)).ToDto()
                };
            }                
        }
    }
}
