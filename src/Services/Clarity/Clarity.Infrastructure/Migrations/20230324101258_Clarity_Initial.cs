using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clarity.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ClarityInitial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Clarity");

            migrationBuilder.CreateTable(
                name: "Boards",
                schema: "Clarity",
                columns: table => new
                {
                    BoardId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Boards", x => x.BoardId);
                });

            migrationBuilder.CreateTable(
                name: "DigitalAssets",
                schema: "Clarity",
                columns: table => new
                {
                    DigitalAssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Bytes = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    ContentType = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DigitalAssets", x => x.DigitalAssetId);
                });

            migrationBuilder.CreateTable(
                name: "TeamMembers",
                schema: "Clarity",
                columns: table => new
                {
                    TeamMemberId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AvatarUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamMembers", x => x.TeamMemberId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                schema: "Clarity",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Salt = table.Column<byte[]>(type: "varbinary(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "BoardStates",
                schema: "Clarity",
                columns: table => new
                {
                    BoardStateId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BoardId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Order = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BoardStates", x => x.BoardStateId);
                    table.ForeignKey(
                        name: "FK_BoardStates_Boards_BoardId",
                        column: x => x.BoardId,
                        principalSchema: "Clarity",
                        principalTable: "Boards",
                        principalColumn: "BoardId");
                });

            migrationBuilder.CreateTable(
                name: "Tickets",
                schema: "Clarity",
                columns: table => new
                {
                    TicketId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeamMemberId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AcceptanceCriteria = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StoryPoints = table.Column<int>(type: "int", nullable: false),
                    Effort = table.Column<int>(type: "int", nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    TicketType = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tickets", x => x.TicketId);
                    table.ForeignKey(
                        name: "FK_Tickets_TeamMembers_TeamMemberId",
                        column: x => x.TeamMemberId,
                        principalSchema: "Clarity",
                        principalTable: "TeamMembers",
                        principalColumn: "TeamMemberId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                schema: "Clarity",
                columns: table => new
                {
                    CommentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TeamMemberId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TicketId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.CommentId);
                    table.ForeignKey(
                        name: "FK_Comments_TeamMembers_TeamMemberId",
                        column: x => x.TeamMemberId,
                        principalSchema: "Clarity",
                        principalTable: "TeamMembers",
                        principalColumn: "TeamMemberId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Comments_Tickets_TicketId",
                        column: x => x.TicketId,
                        principalSchema: "Clarity",
                        principalTable: "Tickets",
                        principalColumn: "TicketId");
                });

            migrationBuilder.CreateTable(
                name: "TicketEffortChanged",
                schema: "Clarity",
                columns: table => new
                {
                    TicketId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Effort = table.Column<int>(type: "int", nullable: false),
                    Changed = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketEffortChanged", x => new { x.TicketId, x.Id });
                    table.ForeignKey(
                        name: "FK_TicketEffortChanged_Tickets_TicketId",
                        column: x => x.TicketId,
                        principalSchema: "Clarity",
                        principalTable: "Tickets",
                        principalColumn: "TicketId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TicketState",
                schema: "Clarity",
                columns: table => new
                {
                    TicketStateId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TicketId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BoardStateId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketState", x => x.TicketStateId);
                    table.ForeignKey(
                        name: "FK_TicketState_BoardStates_BoardStateId",
                        column: x => x.BoardStateId,
                        principalSchema: "Clarity",
                        principalTable: "BoardStates",
                        principalColumn: "BoardStateId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TicketState_Tickets_TicketId",
                        column: x => x.TicketId,
                        principalSchema: "Clarity",
                        principalTable: "Tickets",
                        principalColumn: "TicketId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BoardStates_BoardId",
                schema: "Clarity",
                table: "BoardStates",
                column: "BoardId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_TeamMemberId",
                schema: "Clarity",
                table: "Comments",
                column: "TeamMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_TicketId",
                schema: "Clarity",
                table: "Comments",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_TeamMemberId",
                schema: "Clarity",
                table: "Tickets",
                column: "TeamMemberId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketState_BoardStateId",
                schema: "Clarity",
                table: "TicketState",
                column: "BoardStateId");

            migrationBuilder.CreateIndex(
                name: "IX_TicketState_TicketId",
                schema: "Clarity",
                table: "TicketState",
                column: "TicketId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comments",
                schema: "Clarity");

            migrationBuilder.DropTable(
                name: "DigitalAssets",
                schema: "Clarity");

            migrationBuilder.DropTable(
                name: "TicketEffortChanged",
                schema: "Clarity");

            migrationBuilder.DropTable(
                name: "TicketState",
                schema: "Clarity");

            migrationBuilder.DropTable(
                name: "Users",
                schema: "Clarity");

            migrationBuilder.DropTable(
                name: "BoardStates",
                schema: "Clarity");

            migrationBuilder.DropTable(
                name: "Tickets",
                schema: "Clarity");

            migrationBuilder.DropTable(
                name: "Boards",
                schema: "Clarity");

            migrationBuilder.DropTable(
                name: "TeamMembers",
                schema: "Clarity");
        }
    }
}
