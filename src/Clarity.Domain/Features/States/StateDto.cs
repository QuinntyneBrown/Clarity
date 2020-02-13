using Clarity.Domain.Features.Tickets;
using System.Collections.Generic;

namespace Clarity.Domain.Features.States
{
    public class StateDto
    {        
        public int StateId { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }
        public ICollection<TicketDto> Tickets { get; set; } = new List<TicketDto>();
    }
}
