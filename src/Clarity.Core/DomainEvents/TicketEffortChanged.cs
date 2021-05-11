using Microsoft.EntityFrameworkCore;
using System;

namespace Clarity.Core.DomainEvents
{
    [Owned]
    public record TicketEffortChanged(int Effort, DateTime Changed);
}
