// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.InitiativeAggregate.Queries;

public class GetInitiativesRequest : IRequest<GetInitiativesResponse> { }

public class GetInitiativesResponse
{
    public IEnumerable<InitiativeDto> Initiatives { get; set; }
}

public class GetInitiativesRequestHandler : IRequestHandler<GetInitiativesRequest, GetInitiativesResponse>
{
    private readonly IClarityDbContext _context;

    public GetInitiativesRequestHandler(IClarityDbContext context)
    {
        _context = context;
    }

    public async Task<GetInitiativesResponse> Handle(GetInitiativesRequest request, CancellationToken cancellationToken)
    {
        return new()
        {
            Initiatives = await _context.Initiatives
                .Include(x => x.Tickets)
                .Select(x => x.ToDto())
                .ToListAsync()
        };
    }
}
