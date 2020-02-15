using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Clarity.Api.Migrations
{
    public partial class Boards : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BoardId",
                table: "States",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Boards",
                columns: table => new
                {
                    BoardId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Boards", x => x.BoardId);
                });

            migrationBuilder.CreateTable(
                name: "DigitalAssets",
                columns: table => new
                {
                    DigitalAssetId = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(nullable: true),
                    Bytes = table.Column<byte[]>(nullable: true),
                    ContentType = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DigitalAssets", x => x.DigitalAssetId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Username = table.Column<string>(nullable: true),
                    Password = table.Column<string>(nullable: true),
                    Salt = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_States_BoardId",
                table: "States",
                column: "BoardId");

            migrationBuilder.AddForeignKey(
                name: "FK_States_Boards_BoardId",
                table: "States",
                column: "BoardId",
                principalTable: "Boards",
                principalColumn: "BoardId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_States_Boards_BoardId",
                table: "States");

            migrationBuilder.DropTable(
                name: "Boards");

            migrationBuilder.DropTable(
                name: "DigitalAssets");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropIndex(
                name: "IX_States_BoardId",
                table: "States");

            migrationBuilder.DropColumn(
                name: "BoardId",
                table: "States");
        }
    }
}
