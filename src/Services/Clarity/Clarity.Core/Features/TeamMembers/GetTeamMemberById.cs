using Clarity.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features
{
    public class GetTeamMemberById
    {
        public class Request : IRequest<Response>
        {
            public Guid TeamMemberId { get; set; }
        }

        public class Response
        {
            public TeamMemberDto TeamMember { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IClarityDbContext _context;

            public Handler(IClarityDbContext context) => _context = context;

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                return new()
                {
                    TeamMember = (await _context.TeamMembers.FirstOrDefaultAsync(x => x.TeamMemberId == request.TeamMemberId)).ToDto()
                };
            }
        }
    }
}
