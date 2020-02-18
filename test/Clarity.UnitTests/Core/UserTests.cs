using Clarity.Core.Models;
using Xunit;

namespace Clarity.UnitTests.Core
{
    public class UserTests
    {
        [Fact]
        public void ShouldHaveSaltByDefault()
        {
            var user = new User();
            Assert.NotEqual(default, user.Salt);
        }
    }
}
