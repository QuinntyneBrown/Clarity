// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System;
using Clarity.Core.AggregateModel.BoardStateAggregate;

namespace Clarity.Core.AggregateModel.TicketAggregate;

public class TicketState
{
    public Guid TicketStateId { get; private set; }
    public Guid TicketId { get; private set; }
    public Guid BoardStateId { get; private set; }
    public Ticket Ticket { get; private set; }
    public BoardState BoardState { get; private set; }
    public DateTime Created { get; private set; } = DateTime.UtcNow;
    public TicketState(BoardState boardState)
    {
        BoardState = boardState;
    }
    private TicketState()
    {
    }
}

