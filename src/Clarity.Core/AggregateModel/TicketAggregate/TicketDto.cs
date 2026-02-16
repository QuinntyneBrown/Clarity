// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.BoardStateAggregate;
using Clarity.Core.AggregateModel.TicketAggregate;
using System;
using System.Collections.Generic;

namespace Clarity.Core.AggregateModel;

public class TicketDto
{
    public TicketDto()
    {
        State = StateType.Backlog;
        TicketType = TicketType.Chore;
    }
    public Guid TicketId { get; set; }
    public string Name { get; set; }
    public StateType State { get; set; }
    public Guid BoardStateId { get; set; }
    public string Url { get; set; }
    public int Age { get; set; }
    public string Description { get; set; }
    public string AcceptanceCriteria { get; set; }
    public TicketType TicketType { get; set; }
    public Guid? BoardId { get; set; }
    public List<CommentDto> Comments { get; set; } = new();
}

