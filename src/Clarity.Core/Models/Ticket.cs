using System.Collections.Generic;
using System.Linq;

namespace Clarity.Core.Models
{
    public class Ticket
    {
        public int TicketId { get; set; }
        public string Name { get; set; }
        public ICollection<TicketState> TicketStates { get; set; }
        public TicketState CurrentTicketState { get => TicketStates.OrderByDescending(x => x.Created).FirstOrDefault(); }
        
    }
}
