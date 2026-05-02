// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.UserAggregate;
using Microsoft.AspNetCore.Http;
using Moq;

namespace Clarity.Testing.Builders;

public class HttpContextBuilder
{
    private Mock<HttpContext> _mockHttpContext;

    public HttpContextBuilder()
    {
        _mockHttpContext = new();
    }

    public HttpContextBuilder WithUser(User user)
    {
        _mockHttpContext
            .Setup(x => x.User)
            .Returns(new ClaimsPrincipalBuilder()
            .WithUser(user)
            .Build());
        return this;
    }

    public HttpContext Build()
    {
        return _mockHttpContext.Object;
    }
}

