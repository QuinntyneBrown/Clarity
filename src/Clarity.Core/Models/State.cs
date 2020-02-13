using System.Collections.Generic;

namespace Clarity.Core.Models
{
    public class State
    {
        public int StateId { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }
        public ICollection<TicketState> TicketStates { get; set; }
        
    }
}
