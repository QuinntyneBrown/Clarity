// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel;
using Clarity.Core.AggregateModel.BoardAggregate;
using Clarity.Core.AggregateModel.BoardAggregate.Commands;
using Clarity.Core.AggregateModel.BoardAggregate.Queries;
using Clarity.Testing;
using Clarity.Testing.Builders;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using Xunit;
using static Clarity.IntegrationTests.Controllers.BoardControllerTests.Endpoints;

namespace Clarity.IntegrationTests.Controllers;

public class BoardControllerTests : IClassFixture<ApiTestFixture>
{
    private readonly ApiTestFixture _fixture;
    public BoardControllerTests(ApiTestFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task Should_CreateBoard()
    {
        var context = _fixture.Context;
        
        var board = BoardDtoBuilder.WithDefaults();
        
        StringContent stringContent = new StringContent(JsonConvert.SerializeObject(new { board }), Encoding.UTF8, "application/json");
        
        using var client = _fixture.CreateClient();
        
        var httpResponseMessage = await client.PostAsync(Post.CreateBoard, stringContent);
        
        var response = JsonConvert.DeserializeObject<CreateBoardResponse>(await httpResponseMessage.Content.ReadAsStringAsync());
        
        var sut = context.FindAsync<Board>(response.Board.BoardId);
        
        Assert.NotEqual(default, response.Board.BoardId);
    }

    [Fact]
    public async Task Should_RemoveBoard()
    {
        var board = BoardBuilder.WithDefaults();

        var context = _fixture.Context;

        var client = _fixture.CreateClient();

        await context.SaveChangesAsync(default);

        var httpResponseMessage = await client.DeleteAsync(Delete.By(board.BoardId));

        httpResponseMessage.EnsureSuccessStatusCode();

        var removedBoard = await context.FindAsync<Board>(board.BoardId);
    }

    [Fact]
    public async Task Should_UpdateBoard()
    {
        var board = BoardBuilder.WithDefaults();
        
        StringContent stringContent = new StringContent(JsonConvert.SerializeObject(new { board = board.ToDto() }), Encoding.UTF8, "application/json");
        
        var httpResponseMessage = await _fixture.CreateClient().PutAsync(Put.Update, stringContent);
        
        httpResponseMessage.EnsureSuccessStatusCode();
        
        var sut = await _fixture.Context.FindAsync<Board>(board.BoardId);
    }

    [Fact]
    public async Task Should_GetBoards()
    {
        var httpResponseMessage = await _fixture.CreateClient().GetAsync(Get.Boards);

        httpResponseMessage.EnsureSuccessStatusCode();

        var response = JsonConvert.DeserializeObject<GetBoardsResponse>(await httpResponseMessage.Content.ReadAsStringAsync());

        Assert.True(response.Boards.Any());
    }

    [Fact]
    public async Task Should_GetBoardById()
    {
        var board = BoardBuilder.WithDefaults();

        var httpResponseMessage = await _fixture.CreateClient().GetAsync(Get.By(board.BoardId));
        
        httpResponseMessage.EnsureSuccessStatusCode();
        
        var response = JsonConvert.DeserializeObject<GetBoardByIdResponse>(await httpResponseMessage.Content.ReadAsStringAsync());
        
        Assert.NotNull(response);
    }

    internal static class Endpoints
    {
        public static class Post
        {
            public static string CreateBoard = "api/1.0/board";
        }

        public static class Put
        {
            public static string Update = "api/1.0/board";
        }

        public static class Delete
        {
            public static string By(Guid boardId)
            {
                return $"api/1.0/board/{boardId}";
            }
        }

        public static class Get
        {
            public static string Boards = "api/1.0/board";
            public static string By(Guid boardId)
            {
                return $"api/1.0/board/{boardId}";
            }
        }
    }
}

