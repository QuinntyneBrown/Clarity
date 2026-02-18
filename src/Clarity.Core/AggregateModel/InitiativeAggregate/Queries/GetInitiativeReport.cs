// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Clarity.Core.AggregateModel.InitiativeAggregate.Queries;

public class InitiativeReportDto
{
    public Guid InitiativeId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public DateTime Created { get; set; }
    public int TotalTickets { get; set; }
    public int BacklogTickets { get; set; }
    public int InProgressTickets { get; set; }
    public int DoneTickets { get; set; }
    public int TotalEffort { get; set; }
    public int TotalStoryPoints { get; set; }
    public double PercentComplete { get; set; }
}

public class GetInitiativeReportRequest : IRequest<GetInitiativeReportResponse>
{
    public Guid InitiativeId { get; set; }
}

public class GetInitiativeReportResponse
{
    public InitiativeReportDto Report { get; set; }
}

public class GetInitiativeReportRequestHandler : IRequestHandler<GetInitiativeReportRequest, GetInitiativeReportResponse>
{
    private readonly IClarityDbContext _context;

    public GetInitiativeReportRequestHandler(IClarityDbContext context)
    {
        _context = context;
    }

    public async Task<GetInitiativeReportResponse> Handle(GetInitiativeReportRequest request, CancellationToken cancellationToken)
    {
        var initiative = await _context.Initiatives
            .AsNoTracking()
            .Include(x => x.Tickets)
                .ThenInclude(t => t.TicketStates)
                    .ThenInclude(ts => ts.BoardState)
            .SingleOrDefaultAsync(x => x.InitiativeId == request.InitiativeId, cancellationToken);

        return new()
        {
            Report = initiative?.ToReportDto()
        };
    }
}
