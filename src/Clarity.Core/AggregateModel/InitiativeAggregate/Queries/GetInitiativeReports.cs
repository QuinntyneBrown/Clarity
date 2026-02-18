// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.BoardStateAggregate;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
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
            .Include(x => x.Tickets)
                .ThenInclude(t => t.TicketStates)
                    .ThenInclude(ts => ts.BoardState)
            .ToListAsync(cancellationToken);

        var reports = initiatives.Select(initiative =>
        {
            var tickets = initiative.Tickets;
            var backlog = tickets.Count(t => t.CurrentTicketState.BoardState.Type == StateType.Backlog);
            var inProgress = tickets.Count(t => t.CurrentTicketState.BoardState.Type == StateType.InProgress);
            var done = tickets.Count(t => t.CurrentTicketState.BoardState.Type == StateType.Done);
            var total = tickets.Count;

            return new InitiativeReportDto
            {
                InitiativeId = initiative.InitiativeId,
                Name = initiative.Name,
                Description = initiative.Description,
                Created = initiative.Created,
                TotalTickets = total,
                BacklogTickets = backlog,
                InProgressTickets = inProgress,
                DoneTickets = done,
                TotalEffort = tickets.Sum(t => t.Effort),
                TotalStoryPoints = tickets.Sum(t => t.StoryPoints),
                PercentComplete = total > 0 ? Math.Round((double)done / total * 100, 2) : 0
            };
        });

        return new()
        {
            Reports = reports.ToList()
        };
    }
}
