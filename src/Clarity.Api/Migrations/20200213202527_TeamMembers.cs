using Microsoft.EntityFrameworkCore.Migrations;

namespace Clarity.Api.Migrations
{
    public partial class TeamMembers : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AcceptanceCriteria",
                table: "Tickets",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Tickets",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TeamMemberId",
                table: "Tickets",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TeamMembers",
                columns: table => new
                {
                    TeamMemberId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true),
                    AvatarUrl = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeamMembers", x => x.TeamMemberId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_TeamMemberId",
                table: "Tickets",
                column: "TeamMemberId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_TeamMembers_TeamMemberId",
                table: "Tickets",
                column: "TeamMemberId",
                principalTable: "TeamMembers",
                principalColumn: "TeamMemberId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_TeamMembers_TeamMemberId",
                table: "Tickets");

            migrationBuilder.DropTable(
                name: "TeamMembers");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_TeamMemberId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "AcceptanceCriteria",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "TeamMemberId",
                table: "Tickets");
        }
    }
}
