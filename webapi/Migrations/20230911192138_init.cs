using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace webapi.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Kategori",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    KategoriAdi = table.Column<string>(type: "TEXT", nullable: false),
                    Creator = table.Column<int>(type: "INTEGER", nullable: true),
                    Updater = table.Column<int>(type: "INTEGER", nullable: true),
                    CreationDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdateDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kategori", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Musteri",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Adi = table.Column<string>(type: "TEXT", nullable: false),
                    Soyadi = table.Column<string>(type: "TEXT", nullable: false),
                    TelefonNumarasi = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Creator = table.Column<int>(type: "INTEGER", nullable: true),
                    Updater = table.Column<int>(type: "INTEGER", nullable: true),
                    CreationDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdateDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Musteri", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Teklif",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TeklifNo = table.Column<int>(type: "INTEGER", nullable: false),
                    TeklifTarihi = table.Column<DateTime>(type: "TEXT", nullable: false),
                    TeklifSuresi = table.Column<int>(type: "INTEGER", nullable: false),
                    MusteriId = table.Column<int>(type: "INTEGER", nullable: false),
                    IskontoOrani = table.Column<decimal>(type: "TEXT", nullable: false),
                    ToplamFiyatTRY = table.Column<decimal>(type: "TEXT", nullable: false),
                    ToplamFiyatUSD = table.Column<decimal>(type: "TEXT", nullable: false),
                    ToplamFiyatEUR = table.Column<decimal>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Teklif", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Urun",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UrunAdi = table.Column<string>(type: "TEXT", nullable: false),
                    UrunAciklamasi = table.Column<string>(type: "TEXT", nullable: false),
                    UrunEbadi = table.Column<string>(type: "TEXT", nullable: false),
                    UrunFiyati = table.Column<string>(type: "TEXT", nullable: false),
                    TedarikciFİrma = table.Column<string>(type: "TEXT", nullable: false),
                    KdvOrani = table.Column<string>(type: "TEXT", nullable: false),
                    Kategori = table.Column<string>(type: "TEXT", nullable: false),
                    Creator = table.Column<int>(type: "INTEGER", nullable: true),
                    Updater = table.Column<int>(type: "INTEGER", nullable: true),
                    CreationDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UpdateDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Urun", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TeklifItem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TeklifId = table.Column<int>(type: "INTEGER", nullable: false),
                    UrunId = table.Column<int>(type: "INTEGER", nullable: false),
                    Adet = table.Column<int>(type: "INTEGER", nullable: false),
                    BirimFiyat = table.Column<decimal>(type: "TEXT", nullable: false),
                    ParaBirimi = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TeklifItem", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TeklifItem_Teklif_TeklifId",
                        column: x => x.TeklifId,
                        principalTable: "Teklif",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TeklifItem_TeklifId",
                table: "TeklifItem",
                column: "TeklifId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropTable(
                name: "Kategori");

            migrationBuilder.DropTable(
                name: "Musteri");

            migrationBuilder.DropTable(
                name: "TeklifItem");

            migrationBuilder.DropTable(
                name: "Urun");

            migrationBuilder.DropTable(
                name: "Teklif");
        }
    }
}
