// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.Models;
using Clarity.Domain.Features.Identity;

namespace Clarity.Testing.Builders
{
    public class UserDtoBuilder
    {
        private UserDto _userDto;

        public static UserDto WithDefaults()
        {
            return new UserDto();
        }

        public UserDtoBuilder()
        {
            _userDto = WithDefaults();
        }

        public UserDto Build()
        {
            return _userDto;
        }
    }
}

