// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.BoardStateAggregate;
using Clarity.Core.AggregateModel.InitiativeAggregate;
using Clarity.Core.AggregateModel.InitiativeAggregate.Queries;
using System;
using System.Linq;

namespace Clarity.Core.AggregateModel;

public static class InitiativeExtensions
{
    public static InitiativeDto ToDto(this Initiative initiative)
        => new()
        {
            InitiativeId = initiative.InitiativeId,
            Name = initiative.Name,
            Description = initiative.Description,
            Created = initiative.Created,
            TicketCount = initiative.Tickets.Count
        };

    public static InitiativeReportDto ToReportDto(this Initiative initiative)
    {
        var tickets = initiative.Tickets;
        var backlog = tickets.Count(t => t.CurrentTicketState.BoardState.Type == StateType.Backlog);
        var inProgress = tickets.Count(t => t.CurrentTicketState.BoardState.Type == StateType.InProgress);
        var done = tickets.Count(t => t.CurrentTicketState.BoardState.Type == StateType.Done);
        var total = tickets.Count;

        return new()
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
    }
}
