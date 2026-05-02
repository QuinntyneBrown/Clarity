// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Testing;
using Clarity.Testing.Builders;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Clarity.Core.AggregateModel;
using Clarity.Core.AggregateModel.TeamMemberAggregate;
using Clarity.Core.AggregateModel.TeamMemberAggregate.Queries;
using static Clarity.IntegrationTests.Controllers.TeamMemberControllerTests.Endpoints;

namespace Clarity.IntegrationTests.Controllers;

public class TeamMemberControllerTests : IClassFixture<ApiTestFixture>
{
    private readonly ApiTestFixture _fixture;
    public TeamMemberControllerTests(ApiTestFixture fixture)
    {
        _fixture = fixture;
    }
    [Fact]
    public async Task Should_GetTeamMembers()
    {
        var client = _fixture.CreateClient();
        var httpResponseMessage = await client.GetAsync(Get.TeamMembers);
        httpResponseMessage.EnsureSuccessStatusCode();
        var response = JsonConvert.DeserializeObject<GetTeamMembersResponse>(await httpResponseMessage.Content.ReadAsStringAsync());
        Assert.True(response.TeamMembers.Any());
    }
    [Fact]
    public async Task Should_GetTeamMemberById()
    {
        var client = _fixture.CreateClient();
        var context = _fixture.Context;
        var teamMember = context.TeamMembers.First();
        var httpResponseMessage = await client.GetAsync(Get.ById(teamMember.TeamMemberId));
        httpResponseMessage.EnsureSuccessStatusCode();
        var response = JsonConvert.DeserializeObject<GetTeamMemberByIdResponse>(await httpResponseMessage.Content.ReadAsStringAsync());
        Assert.NotNull(response);
    }
    internal static class Endpoints
    {
        public static class Post
        {
            public static string CreateTeamMember = "api/1.0/teamMember";
        }
        public static class Put
        {
            public static string Update = "api/1.0/teamMember";
        }
        public static class Get
        {
            public static string TeamMembers = "api/1.0/teamMember";
            public static string ById(Guid id)
            {
                return $"api/1.0/teamMember/{id}";
            }
        }
    }
}

