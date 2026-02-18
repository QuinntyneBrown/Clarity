// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.InitiativeAggregate.Queries;

public class GetInitiativeByIdRequest : IRequest<GetInitiativeByIdResponse>
{
    public Guid InitiativeId { get; set; }
}

public class GetInitiativeByIdResponse
{
    public InitiativeDto Initiative { get; set; }
}

public class GetInitiativeByIdRequestHandler : IRequestHandler<GetInitiativeByIdRequest, GetInitiativeByIdResponse>
{
    private readonly IClarityDbContext _context;

    public GetInitiativeByIdRequestHandler(IClarityDbContext context)
    {
        _context = context;
    }

    public async Task<GetInitiativeByIdResponse> Handle(GetInitiativeByIdRequest request, CancellationToken cancellationToken)
    {
        var initiative = await _context.Initiatives
            .AsNoTracking()
            .Include(x => x.Tickets)
            .SingleOrDefaultAsync(x => x.InitiativeId == request.InitiativeId, cancellationToken);

        return new()
        {
            Initiative = initiative?.ToDto()
        };
    }
}
