using Clarity.Core.Models;
using Clarity.Domain.Features.TeamMembers;

namespace Clarity.Domain.Features.Extensions
{
    public static class TeamMemberExtensions
    {
        public static TeamMemberDto ToDto(this TeamMember teamMember)
        {
            return new TeamMemberDto
            {
                TeamMemberId = teamMember.TeamMemberId,
                Name = teamMember.Name
            };
        }
    }
}
