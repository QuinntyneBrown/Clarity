// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Clarity.Core.AggregateModel.TeamAggregate.Queries;

public class GetTeamByIdRequest : IRequest<GetTeamByIdResponse>
{
    public Guid TeamId { get; set; }
}

public class GetTeamByIdResponse
{
    public TeamDto Team { get; set; }
}

public class GetTeamByIdRequestHandler : IRequestHandler<GetTeamByIdRequest, GetTeamByIdResponse>
{
    public IClarityDbContext _context { get; set; }
    public GetTeamByIdRequestHandler(IClarityDbContext context) => _context = context;
    public async Task<GetTeamByIdResponse> Handle(GetTeamByIdRequest request, CancellationToken cancellationToken)
        => new()
        {
            Team = (await _context.Teams
            .Include(x => x.TeamMembers)
            .FirstOrDefaultAsync(x => x.TeamId == request.TeamId)).ToDto()
        };
}
