using Clarity.Core.Models;
using Clarity.Domain.Features.Tickets;
using System.Collections.Generic;

namespace Clarity.Domain.Features
{
    public class BoardStateDto
    {        
        public int StateId { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }
        public StateType Type { get; set; }
        public ICollection<TicketDto> Tickets { get; set; } = new List<TicketDto>();
    }
}
