// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TeamMemberAggregate.Queries;

public class GetCurrentTeamMemberRequest : IRequest<GetCurrentTeamMemberResponse> { }
public class GetCurrentTeamMemberResponse
{
    public TeamMemberDto TeamMember { get; set; }
}
public class GetCurrentTeamMemberHandler : IRequestHandler<GetCurrentTeamMemberRequest, GetCurrentTeamMemberResponse>
{
    private readonly IClarityDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;
    public GetCurrentTeamMemberHandler(IClarityDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }
    public async Task<GetCurrentTeamMemberResponse> Handle(GetCurrentTeamMemberRequest request, CancellationToken cancellationToken)
    {
        var username = _httpContextAccessor.HttpContext.User.Identity.Name;
        return new()
        {
            TeamMember = (await _context.TeamMembers.FirstOrDefaultAsync(x => x.Name == username)).ToDto()
        };
    }
}