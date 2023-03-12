using Clarity.Core.AggregateModel.TeamMemberAggregate;

namespace Clarity.Core.AggregateModel
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
