// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TeamMemberAggregate.Commands;

public class UpsertTeamMemberRequest : IRequest<UpsertTeamMemberResponse>
{
    public TeamMemberDto TeamMember { get; set; }
}

public class UpsertTeamMemberResponse
{
    public TeamMemberDto TeamMember { get; set; }
}

public class UpsertTeamMemberRequestHandler : IRequestHandler<UpsertTeamMemberRequest, UpsertTeamMemberResponse>
{
    private readonly IClarityDbContext _context;

    public UpsertTeamMemberRequestHandler(IClarityDbContext context)
    {
        _context = context;
    }

    public async Task<UpsertTeamMemberResponse> Handle(UpsertTeamMemberRequest request, CancellationToken cancellationToken)
    {
        var teamMember = await _context.TeamMembers
            .FirstOrDefaultAsync(x => x.TeamMemberId == request.TeamMember.TeamMemberId, cancellationToken);

        if (teamMember == null)
        {
            teamMember = new TeamMember(request.TeamMember.Name, request.TeamMember.Email, request.TeamMember.Role);
            _context.TeamMembers.Add(teamMember);
        }
        else
        {
            teamMember.Update(request.TeamMember.Name, request.TeamMember.Email, request.TeamMember.Role);
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new UpsertTeamMemberResponse
        {
            TeamMember = teamMember.ToDto()
        };
    }
}
