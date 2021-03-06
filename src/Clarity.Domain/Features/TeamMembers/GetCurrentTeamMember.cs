using Clarity.Core.Data;
using Clarity.Domain.Features;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Domain.Features
{
    public class GetCurrentTeamMember
    {
        public class Request : IRequest<Response> { }

        public class Response
        {
            public TeamMemberDto TeamMember { get; set; }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly IClarityContext _context;
            private readonly IHttpContextAccessor _httpContextAccessor;
            public Handler(IClarityContext context, IHttpContextAccessor httpContextAccessor) {
                _context = context;
                _httpContextAccessor = httpContextAccessor;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var username = _httpContextAccessor.HttpContext.User.Identity.Name;

                return new Response
                {
                    TeamMember = (await _context.TeamMembers.FirstOrDefaultAsync(x => x.Name == username)).ToDto()
                };
            }
        }
    }
}
