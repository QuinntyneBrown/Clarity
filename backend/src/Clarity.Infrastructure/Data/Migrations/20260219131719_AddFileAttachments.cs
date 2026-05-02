using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Clarity.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddFileAttachments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DigitalAssetInitiative",
                columns: table => new
                {
                    DigitalAssetsDigitalAssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    InitiativeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DigitalAssetInitiative", x => new { x.DigitalAssetsDigitalAssetId, x.InitiativeId });
                    table.ForeignKey(
                        name: "FK_DigitalAssetInitiative_DigitalAssets_DigitalAssetsDigitalAssetId",
                        column: x => x.DigitalAssetsDigitalAssetId,
                        principalTable: "DigitalAssets",
                        principalColumn: "DigitalAssetId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DigitalAssetInitiative_Initiatives_InitiativeId",
                        column: x => x.InitiativeId,
                        principalTable: "Initiatives",
                        principalColumn: "InitiativeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DigitalAssetTicket",
                columns: table => new
                {
                    DigitalAssetsDigitalAssetId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TicketId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DigitalAssetTicket", x => new { x.DigitalAssetsDigitalAssetId, x.TicketId });
                    table.ForeignKey(
                        name: "FK_DigitalAssetTicket_DigitalAssets_DigitalAssetsDigitalAssetId",
                        column: x => x.DigitalAssetsDigitalAssetId,
                        principalTable: "DigitalAssets",
                        principalColumn: "DigitalAssetId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DigitalAssetTicket_Tickets_TicketId",
                        column: x => x.TicketId,
                        principalTable: "Tickets",
                        principalColumn: "TicketId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DigitalAssetInitiative_InitiativeId",
                table: "DigitalAssetInitiative",
                column: "InitiativeId");

            migrationBuilder.CreateIndex(
                name: "IX_DigitalAssetTicket_TicketId",
                table: "DigitalAssetTicket",
                column: "TicketId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DigitalAssetInitiative");

            migrationBuilder.DropTable(
                name: "DigitalAssetTicket");
        }
    }
}
