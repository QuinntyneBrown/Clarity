using Microsoft.EntityFrameworkCore.Migrations;

namespace Clarity.Api.Migrations
{
    public partial class StateChange1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_States_StateId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_StateId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "StateId",
                table: "Tickets");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StateId",
                table: "Tickets",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_StateId",
                table: "Tickets",
                column: "StateId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_States_StateId",
                table: "Tickets",
                column: "StateId",
                principalTable: "States",
                principalColumn: "StateId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
