// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Clarity.Core.AggregateModel.SprintAggregate.Queries;

public class GetSprintsRequest : IRequest<GetSprintsResponse> { }

public class GetSprintsResponse
{
    public ICollection<SprintDto> Sprints { get; set; }
}

public class GetSprintsRequestHandler : IRequestHandler<GetSprintsRequest, GetSprintsResponse>
{
    private readonly IClarityDbContext _context;
    public GetSprintsRequestHandler(IClarityDbContext context) => _context = context;
    public async Task<GetSprintsResponse> Handle(GetSprintsRequest request, CancellationToken cancellationToken)
        => new()
        {
            Sprints = await _context.Sprints
            .Select(x => x.ToDto())
            .ToListAsync()
        };
}
