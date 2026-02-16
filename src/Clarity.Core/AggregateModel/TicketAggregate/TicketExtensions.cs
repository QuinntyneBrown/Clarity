// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.TicketAggregate;
using System;
using System.Linq;

namespace Clarity.Core.AggregateModel;

public static class TicketExtensions
{
    public static TicketDto ToDto(this Ticket ticket)
        => new()
        {
            TicketId = ticket.TicketId,
            Name = ticket.Name,
            State = ticket.CurrentTicketState.BoardState.Type,
            BoardStateId = ticket.CurrentTicketState.BoardState.BoardStateId,
            Url = ticket.Url,
            Age = Convert.ToInt32((DateTime.UtcNow - ticket.CurrentTicketState.Created).TotalDays),
            AcceptanceCriteria = ticket.AcceptanceCriteria,
            Description = ticket.Description,
            BoardId = ticket.CurrentTicketState.BoardState.BoardId,
            Comments = ticket.Comments.OrderByDescending(x => x.Created).Select(x => x.ToDto()).ToList()
        };
}

