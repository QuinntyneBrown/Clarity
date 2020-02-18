using Clarity.Domain.Features.Tickets;
using Clarity.Core.Models;
using System;
using System.Linq;

namespace Clarity.Domain.Features.Extensions
{
    public static class TicketExtensions
    {
        public static TicketDto ToDto(this Ticket ticket)
            => new TicketDto
            {
                TicketId = ticket.TicketId,
                Name = ticket.Name,
                State = ticket.CurrentTicketState?.State?.Name,
                StateId = ticket.CurrentTicketState.State.StateId,
                Url = ticket.Url,
                Age = Convert.ToInt32((DateTime.UtcNow - ticket.CurrentTicketState.Created).TotalDays),
                AcceptanceCriteria = ticket.AcceptanceCriteria,
                Description = ticket.Description,
                BoardId = ticket.CurrentTicketState.State.BoardId,
                Comments = ticket.Comments.Select(x => x.ToDto()).ToList()
            };
    }
}
