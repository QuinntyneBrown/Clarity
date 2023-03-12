using System;
using System.Collections.Generic;

namespace Clarity.Core.Models
{
    public class TeamMember
    {
        public Guid TeamMemberId { get; private set; }
        public string Name { get; private set; }
        public string AvatarUrl { get; private set; }
        public List<Ticket> Tickets { get; private set; } = new();
        public List<Comment> Comments { get; private set; } = new();

        public TeamMember(string name)
        {
            Name = name;
        }

        public TeamMember()
        {

        }
    }
}
