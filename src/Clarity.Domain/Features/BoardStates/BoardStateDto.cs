using Clarity.Core.Models;
using System.Collections.Generic;

namespace Clarity.Domain.Features
{
    public class BoardStateDto
    {
        public int StateId { get; set; }
        public string Name { get; set; }
        public int Order { get; set; }
        public StateType Type { get; set; }
        public List<TicketDto> Tickets { get; set; } = new();
    }
}
