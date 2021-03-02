﻿using Clarity.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Clarity.Core.Data
{
    public class ClarityContext: DbContext, IClarityContext
    {
        public ClarityContext(DbContextOptions options)
            : base(options) { }

        public DbSet<Board> Boards { get; private set; }
        public DbSet<Comment> Comments { get; private set; }
        public DbSet<DigitalAsset> DigitalAssets { get; private set; }        
        public DbSet<BoardState> States { get; private set; }
        public DbSet<TeamMember> TeamMembers { get; private set; }
        public DbSet<Ticket> Tickets { get; private set; }        
        public DbSet<User> Users { get; private set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TicketState>()
                .HasOne(nt => nt.Ticket)
                .WithMany(n => n.TicketStates)
                .HasForeignKey(nt => nt.TicketId);

            modelBuilder.Entity<TicketState>()
                .HasOne(nt => nt.State)
                .WithMany(t => t.TicketStates)
                .HasForeignKey(nt => nt.StateId);

            base.OnModelCreating(modelBuilder);
        }
    }
}
