// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.Models;
using Clarity.Domain.Features;

namespace Clarity.Testing.Builders
{
    public class TeamMemberDtoBuilder
    {
        private TeamMemberDto _teamMemberDto;

        public static TeamMemberDto WithDefaults()
        {
            return new TeamMemberDto();
        }

        public TeamMemberDtoBuilder()
        {
            _teamMemberDto = WithDefaults();
        }

        public TeamMemberDto Build()
        {
            return _teamMemberDto;
        }
    }
}

