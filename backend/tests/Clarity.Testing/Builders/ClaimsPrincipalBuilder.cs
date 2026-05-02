// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.UserAggregate;
using Moq;
using System.Security.Claims;

namespace Clarity.Testing.Builders;

public class ClaimsPrincipalBuilder
{
    private Mock<ClaimsPrincipal> _mockClaimsPrincipal;

    public ClaimsPrincipalBuilder()
    {
        _mockClaimsPrincipal = new Mock<ClaimsPrincipal>();
    }

    public ClaimsPrincipalBuilder WithUser(User user)
    {
        _mockClaimsPrincipal.Setup(x => x.Identity)
            .Returns(new IdentityBuilder()
            .WithUser(user)
            .Build());
        return this;
    }

    public ClaimsPrincipal Build()
    {
        return this._mockClaimsPrincipal.Object;
    }

}

