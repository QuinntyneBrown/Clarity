﻿// <auto-generated />
using System;
using Clarity.Core.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Clarity.Api.Migrations
{
    [DbContext(typeof(ClarityContext))]
    [Migration("20210519102253_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("ProductVersion", "5.0.3")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Clarity.Core.Models.Board", b =>
                {
                    b.Property<Guid>("BoardId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("BoardId");

                    b.ToTable("Boards");
                });

            modelBuilder.Entity("Clarity.Core.Models.BoardState", b =>
                {
                    b.Property<Guid>("BoardStateId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("BoardId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Order")
                        .HasColumnType("int");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.HasKey("BoardStateId");

                    b.HasIndex("BoardId");

                    b.ToTable("BoardStates");
                });

            modelBuilder.Entity("Clarity.Core.Models.Comment", b =>
                {
                    b.Property<Guid>("CommentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("Created")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("TeamMemberId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("TicketId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("CommentId");

                    b.HasIndex("TeamMemberId");

                    b.HasIndex("TicketId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("Clarity.Core.Models.DigitalAsset", b =>
                {
                    b.Property<Guid>("DigitalAssetId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<byte[]>("Bytes")
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("ContentType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("DigitalAssetId");

                    b.ToTable("DigitalAssets");
                });

            modelBuilder.Entity("Clarity.Core.Models.TeamMember", b =>
                {
                    b.Property<Guid>("TeamMemberId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("AvatarUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("TeamMemberId");

                    b.ToTable("TeamMembers");
                });

            modelBuilder.Entity("Clarity.Core.Models.Ticket", b =>
                {
                    b.Property<Guid>("TicketId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("AcceptanceCriteria")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Effort")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Priority")
                        .HasColumnType("int");

                    b.Property<int>("StoryPoints")
                        .HasColumnType("int");

                    b.Property<Guid>("TeamMemberId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Url")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("TicketId");

                    b.HasIndex("TeamMemberId");

                    b.ToTable("Tickets");
                });

            modelBuilder.Entity("Clarity.Core.Models.TicketState", b =>
                {
                    b.Property<Guid>("TicketStateId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("BoardStateId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("Created")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("TicketId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("TicketStateId");

                    b.HasIndex("BoardStateId");

                    b.HasIndex("TicketId");

                    b.ToTable("TicketState");
                });

            modelBuilder.Entity("Clarity.Core.Models.User", b =>
                {
                    b.Property<Guid>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte[]>("Salt")
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("Username")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Clarity.Core.Models.BoardState", b =>
                {
                    b.HasOne("Clarity.Core.Models.Board", "Board")
                        .WithMany("BoardStates")
                        .HasForeignKey("BoardId");

                    b.Navigation("Board");
                });

            modelBuilder.Entity("Clarity.Core.Models.Comment", b =>
                {
                    b.HasOne("Clarity.Core.Models.TeamMember", "TeamMember")
                        .WithMany("Comments")
                        .HasForeignKey("TeamMemberId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Clarity.Core.Models.Ticket", "Ticket")
                        .WithMany("Comments")
                        .HasForeignKey("TicketId");

                    b.Navigation("TeamMember");

                    b.Navigation("Ticket");
                });

            modelBuilder.Entity("Clarity.Core.Models.Ticket", b =>
                {
                    b.HasOne("Clarity.Core.Models.TeamMember", "TeamMember")
                        .WithMany("Tickets")
                        .HasForeignKey("TeamMemberId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.OwnsMany("Clarity.Core.DomainEvents.TicketEffortChanged", "EffortChangedEvents", b1 =>
                        {
                            b1.Property<Guid>("TicketId")
                                .HasColumnType("uniqueidentifier");

                            b1.Property<int>("Id")
                                .ValueGeneratedOnAdd()
                                .HasColumnType("int")
                                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                            b1.Property<DateTime>("Changed")
                                .HasColumnType("datetime2");

                            b1.Property<int>("Effort")
                                .HasColumnType("int");

                            b1.HasKey("TicketId", "Id");

                            b1.ToTable("TicketEffortChanged");

                            b1.WithOwner()
                                .HasForeignKey("TicketId");
                        });

                    b.Navigation("EffortChangedEvents");

                    b.Navigation("TeamMember");
                });

            modelBuilder.Entity("Clarity.Core.Models.TicketState", b =>
                {
                    b.HasOne("Clarity.Core.Models.BoardState", "BoardState")
                        .WithMany("TicketStates")
                        .HasForeignKey("BoardStateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Clarity.Core.Models.Ticket", "Ticket")
                        .WithMany("TicketStates")
                        .HasForeignKey("TicketId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("BoardState");

                    b.Navigation("Ticket");
                });

            modelBuilder.Entity("Clarity.Core.Models.Board", b =>
                {
                    b.Navigation("BoardStates");
                });

            modelBuilder.Entity("Clarity.Core.Models.BoardState", b =>
                {
                    b.Navigation("TicketStates");
                });

            modelBuilder.Entity("Clarity.Core.Models.TeamMember", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("Tickets");
                });

            modelBuilder.Entity("Clarity.Core.Models.Ticket", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("TicketStates");
                });
#pragma warning restore 612, 618
        }
    }
}