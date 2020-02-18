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
    [Migration("20200218080031_AddComment")]
    partial class AddComment
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("Clarity.Core.Models.Board", b =>
                {
                    b.Property<int>("BoardId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("BoardId");

                    b.ToTable("Boards");
                });

            modelBuilder.Entity("Clarity.Core.Models.Comment", b =>
                {
                    b.Property<int>("CommentId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Created")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TicketId")
                        .HasColumnType("int");

                    b.HasKey("CommentId");

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

            modelBuilder.Entity("Clarity.Core.Models.Note", b =>
                {
                    b.Property<int>("NoteId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Created")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("TicketId")
                        .HasColumnType("int");

                    b.HasKey("NoteId");

                    b.HasIndex("TicketId");

                    b.ToTable("Notes");
                });

            modelBuilder.Entity("Clarity.Core.Models.State", b =>
                {
                    b.Property<int>("StateId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("BoardId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Order")
                        .HasColumnType("int");

                    b.HasKey("StateId");

                    b.HasIndex("BoardId");

                    b.ToTable("States");
                });

            modelBuilder.Entity("Clarity.Core.Models.TeamMember", b =>
                {
                    b.Property<int>("TeamMemberId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AvatarUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("TeamMemberId");

                    b.ToTable("TeamMembers");
                });

            modelBuilder.Entity("Clarity.Core.Models.Ticket", b =>
                {
                    b.Property<int>("TicketId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("AcceptanceCriteria")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Priority")
                        .HasColumnType("int");

                    b.Property<int>("TeamMemberId")
                        .HasColumnType("int");

                    b.Property<string>("Url")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("TicketId");

                    b.HasIndex("TeamMemberId");

                    b.ToTable("Tickets");
                });

            modelBuilder.Entity("Clarity.Core.Models.TicketState", b =>
                {
                    b.Property<int>("TicketStateId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<DateTime>("Created")
                        .HasColumnType("datetime2");

                    b.Property<int>("StateId")
                        .HasColumnType("int");

                    b.Property<int>("TicketId")
                        .HasColumnType("int");

                    b.HasKey("TicketStateId");

                    b.HasIndex("StateId");

                    b.HasIndex("TicketId");

                    b.ToTable("TicketState");
                });

            modelBuilder.Entity("Clarity.Core.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte[]>("Salt")
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("Username")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Clarity.Core.Models.Comment", b =>
                {
                    b.HasOne("Clarity.Core.Models.Ticket", "Ticket")
                        .WithMany("Comments")
                        .HasForeignKey("TicketId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Clarity.Core.Models.Note", b =>
                {
                    b.HasOne("Clarity.Core.Models.Ticket", "Ticket")
                        .WithMany("Notes")
                        .HasForeignKey("TicketId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Clarity.Core.Models.State", b =>
                {
                    b.HasOne("Clarity.Core.Models.Board", "Board")
                        .WithMany("States")
                        .HasForeignKey("BoardId");
                });

            modelBuilder.Entity("Clarity.Core.Models.Ticket", b =>
                {
                    b.HasOne("Clarity.Core.Models.TeamMember", "TeamMember")
                        .WithMany("Tickets")
                        .HasForeignKey("TeamMemberId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Clarity.Core.Models.TicketState", b =>
                {
                    b.HasOne("Clarity.Core.Models.State", "State")
                        .WithMany("TicketStates")
                        .HasForeignKey("StateId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Clarity.Core.Models.Ticket", "Ticket")
                        .WithMany("TicketStates")
                        .HasForeignKey("TicketId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
