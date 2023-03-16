// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.UserAggregate;
using Moq;
using System.Security.Principal;

namespace Clarity.Testing.Builders;

public class IdentityBuilder
{
    private Mock<IIdentity> _mockIdentity;

    public IdentityBuilder()
    {
        _mockIdentity = new();
    }

    public IdentityBuilder WithUser(User user)
    {
        _mockIdentity.Setup(x => x.Name)
            .Returns(user.Username);
        return this;
    }

    public IIdentity Build()
    {
        return _mockIdentity.Object;
    }
}

