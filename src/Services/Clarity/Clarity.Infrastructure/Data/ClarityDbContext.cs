// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core;
using Clarity.Core.AggregateModel.BoardAggregate;
using Clarity.Core.AggregateModel.BoardStateAggregate;
using Clarity.Core.AggregateModel.CommentAggregate;
using Clarity.Core.AggregateModel.DigitalAssetAggregate;
using Clarity.Core.AggregateModel.TeamMemberAggregate;
using Clarity.Core.AggregateModel.TicketAggregate;
using Clarity.Core.AggregateModel.UserAggregate;
using Clarity.Core.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace Clarity.Infrastructure.Data;

public class ClarityDbContext : DbContext, IClarityDbContext
{
    public ClarityDbContext(DbContextOptions options)
        : base(options) { }

    public DbSet<Board> Boards { get; private set; }
    public DbSet<Comment> Comments { get; private set; }
    public DbSet<DigitalAsset> DigitalAssets { get; private set; }
    public DbSet<BoardState> BoardStates { get; private set; }
    public DbSet<TeamMember> TeamMembers { get; private set; }
    public DbSet<Ticket> Tickets { get; private set; }
    public DbSet<User> Users { get; private set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("Clarity");

        modelBuilder.Entity<TicketState>()
            .HasOne(nt => nt.Ticket)
            .WithMany(n => n.TicketStates)
            .HasForeignKey(nt => nt.TicketId);

        modelBuilder.Entity<TicketState>()
            .HasOne(nt => nt.BoardState)
            .WithMany(t => t.TicketStates)
            .HasForeignKey(nt => nt.BoardStateId);

        modelBuilder.Entity<Ticket>()
            .Property(x => x.Description)
            .HasConversion(
            property => (string)property,
            property => (Html)property);

        modelBuilder.Entity<Ticket>()
            .Property(x => x.AcceptanceCriteria)
            .HasConversion(
            property => (string)property,
            property => (Html)property);

        modelBuilder.Entity<Comment>()
            .Property(x => x.Description)
            .HasConversion(
            property => (string)property,
            property => (Html)property);

        base.OnModelCreating(modelBuilder);
    }
}

