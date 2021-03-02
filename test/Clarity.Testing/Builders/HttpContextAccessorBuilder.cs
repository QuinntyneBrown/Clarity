using Clarity.Core.Models;
using Microsoft.AspNetCore.Http;
using Moq;
using System.Security.Claims;
using System.Security.Principal;

namespace Clarity.Testing.Builders
{
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
}
