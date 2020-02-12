﻿using Clarity.Domain.Features.Tickets;
using Clarity.Core.Models;

namespace Clarity.Domain.Features.Extensions
{
    public static class TicketExtensions
    {
        public static TicketDto ToDto(this Ticket ticket)
            => new TicketDto
            {
                Name = ticket.Name,
                State = ticket.CurrentTicketState?.State?.Name
            };
    }
}
