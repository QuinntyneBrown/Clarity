// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core.AggregateModel.InitiativeAggregate;
using Clarity.Core.AggregateModel.TicketAggregate;
using Clarity.Core.AggregateModel.TicketAggregate.Commands;
using Clarity.Core.AggregateModel.UserAggregate;
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

        var board = _context.Boards.Include(b => b.BoardStates).First();
        var boardState = board.BoardStates.First();

        var actual = await _sut.Handle(new()
        {
            Ticket = new()
            {
                Name = "Test",
                BoardId = board.BoardId,
                BoardStateId = boardState.BoardStateId
            }
        }, default);

        var updatedBoardState = await _context.BoardStates
            .Include(x => x.TicketStates)
            .ThenInclude(x => x.Ticket)
            .SingleAsync(x => x.BoardStateId == boardState.BoardStateId);

        Assert.Single(updatedBoardState.TicketStates);
        Assert.Equal("Test", updatedBoardState.TicketStates.First().Ticket.Name);
    }

    [Fact]
    public async Task CanUpdateTicket()
    {
        var expectedName = "Test1";

        SetUp($"{nameof(UpsertTicketTests)}{nameof(CanUpdateTicket)}");

        var board = _context.Boards.Include(b => b.BoardStates).First();
        var boardState = board.BoardStates.First();

        var ticket = new Ticket(Guid.NewGuid(), "Test", default, default, default);

        _context.Tickets.Add(ticket);

        await _context.SaveChangesAsync(default);

        _ = await _sut.Handle(new()
        {
            Ticket = new()
            {
                TicketId = ticket.TicketId,
                Name = expectedName,
                BoardId = board.BoardId,
                BoardStateId = boardState.BoardStateId
            }
        }, default);

        var actual = _context.Tickets.Find(ticket.TicketId);

        Assert.Equal(expectedName, actual.Name);
    }

    [Fact]
    public async Task CanSetInitiativeIdOnCreate()
    {
        SetUp($"{nameof(UpsertTicketTests)}{nameof(CanSetInitiativeIdOnCreate)}");

        var initiative = new Initiative("Test Initiative", "Test Description");
        _context.Initiatives.Add(initiative);
        await _context.SaveChangesAsync(default);

        var board = _context.Boards.Include(b => b.BoardStates).First();
        var boardState = board.BoardStates.First();

        var actual = await _sut.Handle(new()
        {
            Ticket = new()
            {
                Name = "Test Ticket",
                BoardId = board.BoardId,
                BoardStateId = boardState.BoardStateId,
                InitiativeId = initiative.InitiativeId
            }
        }, default);

        var updatedTicket = await _context.Tickets
            .Include(x => x.Initiative)
            .FirstAsync(x => x.Name == "Test Ticket");

        Assert.Equal(initiative.InitiativeId, updatedTicket.InitiativeId);
        Assert.NotNull(updatedTicket.Initiative);
        Assert.Equal("Test Initiative", updatedTicket.Initiative.Name);
    }

    [Fact]
    public async Task CanSetInitiativeIdOnUpdate()
    {
        SetUp($"{nameof(UpsertTicketTests)}{nameof(CanSetInitiativeIdOnUpdate)}");

        var initiative = new Initiative("Test Initiative", "Test Description");
        _context.Initiatives.Add(initiative);

        var board = _context.Boards.Include(b => b.BoardStates).First();
        var boardState = board.BoardStates.First();

        var ticket = new Ticket(Guid.NewGuid(), "Test", default, default, default);
        _context.Tickets.Add(ticket);

        await _context.SaveChangesAsync(default);

        _ = await _sut.Handle(new()
        {
            Ticket = new()
            {
                TicketId = ticket.TicketId,
                Name = "Updated Test",
                BoardId = board.BoardId,
                BoardStateId = boardState.BoardStateId,
                InitiativeId = initiative.InitiativeId
            }
        }, default);

        var actual = await _context.Tickets
            .Include(x => x.Initiative)
            .FirstAsync(x => x.TicketId == ticket.TicketId);

        Assert.Equal(initiative.InitiativeId, actual.InitiativeId);
        Assert.NotNull(actual.Initiative);
        Assert.Equal("Test Initiative", actual.Initiative.Name);
    }


    private void SetUp(string databaseName = "")
    {
        _context = ClarityDbContextBuilder.WithDefaults(databaseName);
        var teamMember = _context.TeamMembers.First();
        var user = new User(teamMember.Name);
        _httpContextAccessor = new HttpContextAccessorBuilder()
            .WithUser(user)
            .Build();
        _sut = new UpsertTicketRequestHandler(_context, _httpContextAccessor);
    }

    private UpsertTicketRequestHandler Create()
        => new UpsertTicketRequestHandler(_context, _httpContextAccessor);
}
