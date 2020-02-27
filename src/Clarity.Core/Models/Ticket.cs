using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Clarity.Core.Models
{
    public class Ticket
    {
        public int TicketId { get; set; }
        [ForeignKey("TeamMember")]
        public int TeamMemberId { get; set; }
        public string Name { get; set; }
        public string Url { get; set; }
        public string Description { get; set; }
        public string AcceptanceCriteria { get; set; }
        public int Priority { get; set; }
        public TeamMember TeamMember { get; set; }
        public ICollection<TicketState> TicketStates { get; set; } = new HashSet<TicketState>();
        public TicketState CurrentTicketState { get => TicketStates.OrderByDescending(x => x.Created).First(); }        
        public ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();
    }
}
