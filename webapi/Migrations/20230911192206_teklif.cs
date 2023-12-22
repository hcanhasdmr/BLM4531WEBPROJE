using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webapi.Migrations
{
    /// <inheritdoc />
    public partial class teklif : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ToplamFiyatUSD",
                table: "Teklif",
                newName: "ToplamFiyatUSD");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ToplamFiyatEUR",
                table: "Teklif");

            migrationBuilder.DropColumn(
                name: "ToplamFiyatTRY",
                table: "Teklif");

            migrationBuilder.RenameColumn(
                name: "ToplamFiyatUSD",
                table: "Teklif",
                newName: "ToplamFiyat");
        }
    }
}
