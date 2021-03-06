﻿using Clarity.Core.Data;
using Clarity.Core.Models;
using Clarity.Domain.Features;
using Clarity.Testing.Builders;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Clarity.UnitTests.Domain
{
    public class UpsertTicketTests
    {
        private UpsertTicket.Handler _sut;
        private IClarityContext _context;
        private IHttpContextAccessor _httpContextAccessor;

        [Fact]
        public async Task CanCreateTicket()
        {
            SetUp($"{nameof(UpsertTicketTests)}{nameof(CanCreateTicket)}");

            var actual = await _sut.Handle(new() { Ticket = new() {
                Name = "Test",
                BoardId = 1,
                BoardStateId = 1
            } }, default);

            var boardState = await _context.BoardStates
                .Include(x => x.TicketStates)
                .SingleAsync(x => x.BoardStateId == 1);

            Assert.Single(boardState.TicketStates);
            Assert.Equal("Test", boardState.TicketStates.First().Ticket.Name);
        }

        [Fact]
        public async Task CanUpdateTicket()
        {
            var expectedName = "Test1";

            SetUp($"{nameof(UpsertTicketTests)}{nameof(CanUpdateTicket)}");

            var ticket = new Ticket()
            {
                Name = "Test",
                TeamMemberId = 1,                
            };

            _context.Tickets.Add(ticket);

            await _context.SaveChangesAsync(default);

            _ = await _sut.Handle(new()
            {
                Ticket = new()
                {
                    TicketId=  ticket.TicketId,
                    Name = expectedName,
                    BoardId = 1,
                    BoardStateId = 1
                }
            }, default);

            var actual = _context.Tickets.Find(ticket.TicketId);

            Assert.Equal(expectedName, actual.Name);
        }


        private void SetUp(string databaseName = "")
        {
            _context = ClarityContextBuilder.WithDefaults(databaseName);
            _httpContextAccessor = new HttpContextAccessorBuilder()
                .WithUser(_context.Users.Find(1))
                .Build();
            _sut = new UpsertTicket.Handler(_context,_httpContextAccessor);
        }

        private UpsertTicket.Handler Create()
            => new UpsertTicket.Handler(_context, _httpContextAccessor);
    }
}
