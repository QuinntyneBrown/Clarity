using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TeamMemberAggregate.Queries;

public class GetTeamMembers
{
    public class GetTeamMembersRequest : IRequest<GetTeamMembersResponse> { }
    public class GetTeamMembersResponse
    {
        public IEnumerable<TeamMemberDto> TeamMembers { get; set; }
    }
    public class GetTeamMembersHandler : IRequestHandler<GetTeamMembersRequest, GetTeamMembersResponse>
    {
        private readonly IClarityDbContext _context;
        public GetTeamMembersHandler(IClarityDbContext context) => _context = context;
        public Task<GetTeamMembersResponse> Handle(GetTeamMembersRequest request, CancellationToken cancellationToken)
            => Task.FromResult(new GetTeamMembersResponse()
            {
                TeamMembers = _context.TeamMembers
                .Select(x => x.ToDto())
                .ToList()
            });
    }
}
