// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.UserAggregate;
using Microsoft.AspNetCore.Http;
using Moq;

namespace Clarity.Testing.Builders;

public class HttpContextAccessorBuilder
{
    private Mock<IHttpContextAccessor> _mockHttpContextAccessor;
    public HttpContextAccessorBuilder()
    {
        _mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
    }

    public HttpContextAccessorBuilder WithUser(User user)
    {
        _mockHttpContextAccessor
            .Setup(x => x.HttpContext)
            .Returns(new HttpContextBuilder()
            .WithUser(user)
            .Build());
        return this;
    }

    public IHttpContextAccessor Build()
    {
        return _mockHttpContextAccessor.Object;
    }
}

