// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Clarity.Core.AggregateModel.TeamAggregate.Queries;

public class GetTeamsRequest : IRequest<GetTeamsResponse> { }

public class GetTeamsResponse
{
    public ICollection<TeamDto> Teams { get; set; }
}

public class GetTeamsRequestHandler : IRequestHandler<GetTeamsRequest, GetTeamsResponse>
{
    private readonly IClarityDbContext _context;
    public GetTeamsRequestHandler(IClarityDbContext context) => _context = context;
    public async Task<GetTeamsResponse> Handle(GetTeamsRequest request, CancellationToken cancellationToken)
        => new()
        {
            Teams = await _context.Teams
            .Include(x => x.TeamMembers)
            .Select(x => x.ToDto())
            .ToListAsync()
        };
}
