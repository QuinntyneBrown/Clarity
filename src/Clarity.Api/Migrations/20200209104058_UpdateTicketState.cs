using Microsoft.EntityFrameworkCore.Migrations;

namespace Clarity.Api.Migrations
{
    public partial class UpdateTicketState : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "States",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Order",
                table: "States");
        }
    }
}
