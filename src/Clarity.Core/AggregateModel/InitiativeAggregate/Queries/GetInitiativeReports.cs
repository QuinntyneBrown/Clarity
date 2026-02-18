// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.InitiativeAggregate.Queries;

public class GetInitiativeReportsRequest : IRequest<GetInitiativeReportsResponse> { }

public class GetInitiativeReportsResponse
{
    public IEnumerable<InitiativeReportDto> Reports { get; set; }
}

public class GetInitiativeReportsRequestHandler : IRequestHandler<GetInitiativeReportsRequest, GetInitiativeReportsResponse>
{
    private readonly IClarityDbContext _context;

    public GetInitiativeReportsRequestHandler(IClarityDbContext context)
    {
        _context = context;
    }

    public async Task<GetInitiativeReportsResponse> Handle(GetInitiativeReportsRequest request, CancellationToken cancellationToken)
    {
        var initiatives = await _context.Initiatives
            .AsNoTracking()
            .Include(x => x.Tickets)
                .ThenInclude(t => t.TicketStates)
                    .ThenInclude(ts => ts.BoardState)
            .ToListAsync(cancellationToken);

        return new()
        {
            Reports = initiatives.Select(x => x.ToReportDto()).ToList()
        };
    }
}
