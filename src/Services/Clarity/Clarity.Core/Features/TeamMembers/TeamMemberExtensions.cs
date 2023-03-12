using Clarity.Core.Models;

namespace Clarity.Domain.Features
{
    public static class TeamMemberExtensions
    {
        public static TeamMemberDto ToDto(this TeamMember teamMember)
            => new()
        {
            TeamMemberId = teamMember.TeamMemberId,
            Name = teamMember.Name
        };
    }
}
