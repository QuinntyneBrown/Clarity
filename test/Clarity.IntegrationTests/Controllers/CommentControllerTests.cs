// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.CommentAggregate;
using Clarity.Core.AggregateModel.CommentAggregate.Commands;
using Clarity.Testing;
using Clarity.Testing.Builders;
using Newtonsoft.Json;
using System.Net.Http;
using System.Text;
using Xunit;
using static Clarity.IntegrationTests.Controllers.CommentControllerTests.Endpoints;


namespace Clarity.IntegrationTests.Controllers;

public class CommentControllerTests : IClassFixture<ApiTestFixture>
{
    private readonly ApiTestFixture _fixture;

    public CommentControllerTests(ApiTestFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task Should_UpsertComment()
    {
        var context = _fixture.Context;
        var comment = CommentDtoBuilder.WithDefaults();
        StringContent stringContent = new StringContent(JsonConvert.SerializeObject(new { comment }), Encoding.UTF8, "application/json");
        using var client = _fixture.CreateClient();
        var httpResponseMessage = await client.PostAsync(Post.Upsert, stringContent);
        var response = JsonConvert.DeserializeObject<UpsertCommentResponse>(await httpResponseMessage.Content.ReadAsStringAsync());
        var sut = context.FindAsync<Comment>(response.CommentId);
        Assert.NotEqual(default, sut);
    }

    internal static class Endpoints
    {
        public static class Post
        {
            public static string Upsert = "api/1.0/comment";
        }
    }
}

