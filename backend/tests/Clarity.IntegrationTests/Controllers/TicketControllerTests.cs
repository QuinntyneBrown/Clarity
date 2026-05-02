// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.TicketAggregate;
using Clarity.Core.AggregateModel.TicketAggregate.Commands;
using Clarity.Core.AggregateModel.TicketAggregate.Queries;
using Clarity.Testing;
using Clarity.Testing.Builders;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Clarity.Core.AggregateModel;
using static Clarity.IntegrationTests.Controllers.TicketControllerTests.Endpoints;

namespace Clarity.IntegrationTests.Controllers;

public class TicketControllerTests : IClassFixture<ApiTestFixture>
{
    private readonly ApiTestFixture _fixture;
    public TicketControllerTests(ApiTestFixture fixture)
    {
        _fixture = fixture;
    }

    [Fact]
    public async Task Should_UpsertTicket()
    {
        var context = _fixture.Context;
        var ticket = TicketDtoBuilder.WithDefaults();
        StringContent stringContent = new StringContent(JsonConvert.SerializeObject(new { ticket }), Encoding.UTF8, "application/json");
        using var client = _fixture.CreateClient();
        var httpResponseMessage = await client.PostAsync(Post.CreateTicket, stringContent);
        var response = JsonConvert.DeserializeObject<UpsertTicketResponse>(await httpResponseMessage.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task Should_RemoveTicket()
    {
        var ticket = TicketBuilder.WithDefaults();
        var context = _fixture.Context;
        var client = _fixture.CreateClient();
        await context.SaveChangesAsync(default);
        var httpResponseMessage = await client.DeleteAsync(Delete.ById(ticket.TicketId));
        httpResponseMessage.EnsureSuccessStatusCode();
        var removedTicket = await context.FindAsync<Ticket>(ticket.TicketId);
    }

    [Fact]
    public async Task Should_UpdateTicket()
    {
        var ticket = TicketBuilder.WithDefaults();
        var context = _fixture.Context;
        await context.SaveChangesAsync(default);
        StringContent stringContent = new StringContent(JsonConvert.SerializeObject(new { ticket = ticket.ToDto() }), Encoding.UTF8, "application/json");
        var httpResponseMessage = await _fixture.CreateClient().PutAsync(Put.Update, stringContent);
        httpResponseMessage.EnsureSuccessStatusCode();
        var sut = await context.FindAsync<Ticket>(ticket.TicketId);
    }

    [Fact]
    public async Task Should_GetTickets()
    {
        var ticket = TicketBuilder.WithDefaults();
        var context = _fixture.Context;
        await context.SaveChangesAsync(default);
        var httpResponseMessage = await _fixture.CreateClient().GetAsync(Get.Tickets);
        httpResponseMessage.EnsureSuccessStatusCode();
        var response = JsonConvert.DeserializeObject<GetTicketsResponse>(await httpResponseMessage.Content.ReadAsStringAsync());
        Assert.True(response.Tickets.Any());
    }

    internal static class Endpoints
    {
        public static class Post
        {
            public static string CreateTicket = "api/1.0/ticket";
        }
        public static class Put
        {
            public static string Update = "api/1.0/ticket";
        }
        public static class Delete
        {
            public static string ById(Guid ticketId)
            {
                return $"api/1.0/ticket/{ticketId}";
            }
        }
        public static class Get
        {
            public static string Tickets = "api/1.0/ticket";
            public static string ById(Guid ticketId)
            {
                return $"api/1.0/ticket/{ticketId}";
            }
        }
    }
}

