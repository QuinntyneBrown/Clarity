using Clarity.Core.Models;
using Clarity.Domain.Features;
using Clarity.Testing;
using Clarity.Testing.Builders;
using Newtonsoft.Json;
using System.Linq;
using System.Net.Http;
using System.Text;
using Xunit;
using System.Threading.Tasks;
using static Clarity.IntegrationTests.Controllers.TeamMemberControllerTests.Endpoints;

namespace Clarity.IntegrationTests.Controllers
{
    public class TeamMemberControllerTests : IClassFixture<ApiFixture>
    {
        private readonly ApiFixture _fixture;
        public TeamMemberControllerTests(ApiFixture fixture)
        {
            _fixture = fixture;
        }


        [Fact]
        public async Task Should_GetTeamMembers()
        {
            var teamMember = TeamMemberBuilder.WithDefaults();

            var context = _fixture.Context;

            
            await context.SaveChangesAsync(default);

            var httpResponseMessage = await _fixture.CreateClient().GetAsync(Get.TeamMembers);

            httpResponseMessage.EnsureSuccessStatusCode();

            var response = JsonConvert.DeserializeObject<GetTeamMembers.Response>(await httpResponseMessage.Content.ReadAsStringAsync());

            Assert.True(response.TeamMembers.Any());
        }

        [Fact]
        public async Task Should_GetTeamMemberById()
        {
            var teamMember = TeamMemberBuilder.WithDefaults();

            var context = _fixture.Context;

            await context.SaveChangesAsync(default);

            var httpResponseMessage = await _fixture.CreateClient().GetAsync(Get.ById(teamMember.TeamMemberId));

            httpResponseMessage.EnsureSuccessStatusCode();

            var response = JsonConvert.DeserializeObject<GetTeamMemberById.Response>(await httpResponseMessage.Content.ReadAsStringAsync());

            Assert.NotNull(response);

        }

        internal static class Endpoints
        {
            public static class Post
            {
                public static string CreateTeamMember = "api/teamMember";
            }

            public static class Put
            {
                public static string Update = "api/teamMember";
            }


            public static class Get
            {
                public static string TeamMembers = "api/teamMember";

                public static string ById(int id)
                {
                    return $"api/teamMember/{id}";
                }

            }
        }
    }
}
