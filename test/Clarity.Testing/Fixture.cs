using Clarity.Api;
using Microsoft.AspNetCore.Mvc.Testing;
using Clarity.Core.Data;
namespace Clarity.Testing
{
    public class ApiFixture : WebApplicationFactory<Startup>
    {

        public ClarityContext Context => default;
    }
}
