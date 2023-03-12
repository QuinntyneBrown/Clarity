// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

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

