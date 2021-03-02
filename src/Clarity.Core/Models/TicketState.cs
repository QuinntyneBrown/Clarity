using System;

namespace Clarity.Core.Models
{
    public class TicketState
    {
        public int TicketStateId { get; set; }
        public int TicketId { get; set; }
        public int BoardStateId { get; set; }
        public Ticket Ticket { get; set; }
        public BoardState BoardState { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
    }
}
