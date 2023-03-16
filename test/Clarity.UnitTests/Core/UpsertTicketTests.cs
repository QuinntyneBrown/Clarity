// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.TicketAggregate;
using Clarity.Core.AggregateModel.TicketAggregate.Commands;
using Clarity.Testing.Builders;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using Xunit;


namespace Clarity.UnitTests.Core;

public class UpsertTicketTests
{
    private UpsertTicketRequestHandler _sut;
    private IClarityDbContext _context;
    private IHttpContextAccessor _httpContextAccessor;

    [Fact]
    public async Task CanCreateTicket()
    {
        SetUp($"{nameof(UpsertTicketTests)}{nameof(CanCreateTicket)}");

        var actual = await _sut.Handle(new()
        {
            Ticket = new()
            {
                Name = "Test",
                BoardId = Guid.NewGuid(),
                BoardStateId = Guid.NewGuid()
            }
        }, default);

        var boardState = await _context.BoardStates
            .Include(x => x.TicketStates)
            .SingleAsync(x => x.BoardStateId == Guid.NewGuid());

        Assert.Single(boardState.TicketStates);
        Assert.Equal("Test", boardState.TicketStates.First().Ticket.Name);
    }

    [Fact]
    public async Task CanUpdateTicket()
    {
        var expectedName = "Test1";

        SetUp($"{nameof(UpsertTicketTests)}{nameof(CanUpdateTicket)}");

        var ticket = new Ticket(Guid.NewGuid(), "Test", default, default, default);

        _context.Tickets.Add(ticket);

        await _context.SaveChangesAsync(default);

        _ = await _sut.Handle(new()
        {
            Ticket = new()
            {
                TicketId = ticket.TicketId,
                Name = expectedName,
                BoardId = Guid.NewGuid(),
                BoardStateId = Guid.NewGuid()
            }
        }, default);

        var actual = _context.Tickets.Find(ticket.TicketId);

        Assert.Equal(expectedName, actual.Name);
    }


    private void SetUp(string databaseName = "")
    {
        _context = ClarityDbContextBuilder.WithDefaults(databaseName);
        _httpContextAccessor = new HttpContextAccessorBuilder()
            .WithUser(_context.Users.Find(1))
            .Build();
        _sut = new UpsertTicketRequestHandler(_context, _httpContextAccessor);
    }

    private UpsertTicketRequestHandler Create()
        => new UpsertTicketRequestHandler(_context, _httpContextAccessor);
}


