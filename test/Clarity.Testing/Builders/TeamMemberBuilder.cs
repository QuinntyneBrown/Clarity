using Clarity.Core.Models;

namespace Clarity.Testing.Builders
{
    public class TeamMemberBuilder
    {
        private TeamMember _teamMember;

        public static TeamMember WithDefaults()
        {
            return new TeamMember();
        }

        public TeamMemberBuilder()
        {
            _teamMember = WithDefaults();
        }

        public TeamMember Build()
        {
            return _teamMember;
        }
    }
}
