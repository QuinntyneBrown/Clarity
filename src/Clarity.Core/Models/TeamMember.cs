using System;
using System.Collections.Generic;
using System.Text;

namespace Clarity.Core.Models
{
    public class TeamMember
    {
        public int TeamMemberId { get; set; }
        public string Name { get; set; }
        public string AvatarUrl { get; set; }
        public ICollection<Ticket> Tickets { get; set; } = new HashSet<Ticket>();
    }
}
