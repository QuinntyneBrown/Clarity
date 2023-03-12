// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.Models;

namespace Clarity.Testing.Builders
{
    public class UserBuilder
    {
        private User _user;

        public static User WithDefaults()
        {
            return new User(default);
        }

        public UserBuilder()
        {
            _user = WithDefaults();
        }

        public User Build()
        {
            return _user;
        }
    }
}

