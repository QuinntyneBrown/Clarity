// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Clarity.Core;
using Clarity.Core.AggregateModel.BoardAggregate;
using Clarity.Core.AggregateModel.BoardStateAggregate;
using Clarity.Core.AggregateModel.CommentAggregate;
using Clarity.Core.AggregateModel.DigitalAssetAggregate;
using Clarity.Core.AggregateModel.PrivilegeAggregate;
using Clarity.Core.AggregateModel.RoleAggregate;
using Clarity.Core.AggregateModel.SprintAggregate;
using Clarity.Core.AggregateModel.TeamAggregate;
using Clarity.Core.AggregateModel.TeamMemberAggregate;
using Clarity.Core.AggregateModel.TicketAggregate;
using Clarity.Core.AggregateModel.UserAggregate;
using Clarity.Core.AggregateModel.UserSettingsAggregate;
using Clarity.Core.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace Clarity.Infrastructure.Data;

public class ClarityDbContext : DbContext, IClarityDbContext
{
    public ClarityDbContext(DbContextOptions<ClarityDbContext> options)
        : base(options) { }

    public DbSet<Board> Boards { get; private set; }
    public DbSet<Comment> Comments { get; private set; }
    public DbSet<DigitalAsset> DigitalAssets { get; private set; }
    public DbSet<BoardState> BoardStates { get; private set; }
    public DbSet<Privilege> Privileges { get; private set; }
    public DbSet<Role> Roles { get; private set; }
    public DbSet<Sprint> Sprints { get; private set; }
    public DbSet<Team> Teams { get; private set; }
    public DbSet<TeamMember> TeamMembers { get; private set; }
    public DbSet<Ticket> Tickets { get; private set; }
    public DbSet<User> Users { get; private set; }
    public DbSet<UserSettings> UserSettings { get; private set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
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

        modelBuilder.Entity<User>()
            .HasMany(u => u.Roles)
            .WithMany(r => r.Users);

        modelBuilder.Entity<Role>()
            .HasMany(r => r.Privileges)
            .WithOne()
            .HasForeignKey(p => p.RoleId);

        modelBuilder.Entity<UserSettings>()
            .HasOne(us => us.User)
            .WithMany()
            .HasForeignKey(us => us.UserId);

        modelBuilder.Entity<Sprint>()
            .HasOne(s => s.Team)
            .WithMany()
            .HasForeignKey(s => s.TeamId);

        base.OnModelCreating(modelBuilder);
    }
}
