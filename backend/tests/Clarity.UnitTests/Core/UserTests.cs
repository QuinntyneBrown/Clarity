// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.UserAggregate;
using Xunit;


namespace Clarity.UnitTests.Core;

public class UserTests
{
    [Fact]
    public void ShouldHaveSaltByDefault()
    {
        var user = new User(default);
        Assert.NotEqual(default, user.Salt);
    }
}


