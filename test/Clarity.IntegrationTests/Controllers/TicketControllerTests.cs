using Clarity.Core.Models;
using Clarity.Domain.Features;
using Clarity.Testing;
using Clarity.Testing.Builders;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using static Clarity.IntegrationTests.Controllers.TicketControllerTests.Endpoints;

namespace Clarity.IntegrationTests.Controllers
{
    public class TicketControllerTests : IClassFixture<ApiFixture>
    {
        private readonly ApiFixture _fixture;
        public TicketControllerTests(ApiFixture fixture)
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

            var response = JsonConvert.DeserializeObject<UpsertTicket.Response>(await httpResponseMessage.Content.ReadAsStringAsync());

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

            var response = JsonConvert.DeserializeObject<GetTickets.Response>(await httpResponseMessage.Content.ReadAsStringAsync());

            Assert.True(response.Tickets.Any());
        }

        internal static class Endpoints
        {
            public static class Post
            {
                public static string CreateTicket = "api/ticket";
            }

            public static class Put
            {
                public static string Update = "api/ticket";
            }

            public static class Delete
            {
                public static string ById(Guid ticketId)
                {
                    return $"api/ticket/{ticketId}";
                }
            }

            public static class Get
            {
                public static string Tickets = "api/ticket";
                public static string ById(Guid ticketId)
                {
                    return $"api/ticket/{ticketId}";
                }
            }
        }
    }
}
