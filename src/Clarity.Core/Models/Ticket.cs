using System.Collections.Generic;
using System.Linq;

namespace Clarity.Core.Models
{
    public class Ticket
    {
        public int TicketId { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public ICollection<TicketState> TicketStates { get; set; } = new HashSet<TicketState>();
        public TicketState CurrentTicketState { get => TicketStates.OrderByDescending(x => x.Created).FirstOrDefault(); }
        public ICollection<Note> Notes { get; set; } = new HashSet<Note>();
    }
}
