// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.InitiativeAggregate;

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
}
