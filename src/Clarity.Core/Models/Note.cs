using System;

namespace Clarity.Core.Models
{
    public class Note
    {
        public int NoteId { get; set; }
        public int TicketId { get; set; }
        public string Description { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public Ticket Ticket { get; set; }
    }
}
