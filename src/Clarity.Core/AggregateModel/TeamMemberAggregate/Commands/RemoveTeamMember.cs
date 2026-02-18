// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.TeamMemberAggregate.Commands;

public class RemoveTeamMemberRequest : IRequest<RemoveTeamMemberResponse>
{
    public Guid TeamMemberId { get; set; }
}

public class RemoveTeamMemberResponse { }

public class RemoveTeamMemberRequestHandler : IRequestHandler<RemoveTeamMemberRequest, RemoveTeamMemberResponse>
{
    private readonly IClarityDbContext _context;

    public RemoveTeamMemberRequestHandler(IClarityDbContext context)
    {
        _context = context;
    }

    public async Task<RemoveTeamMemberResponse> Handle(RemoveTeamMemberRequest request, CancellationToken cancellationToken)
    {
        var teamMember = await _context.TeamMembers.FindAsync(request.TeamMemberId);

        _context.TeamMembers.Remove(teamMember);

        await _context.SaveChangesAsync(cancellationToken);

        return new RemoveTeamMemberResponse();
    }
}
