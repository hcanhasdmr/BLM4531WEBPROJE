using Microsoft.EntityFrameworkCore;
using webapi.Entity;
using webapi.Entity.Log;

namespace webapi.Data
{
    public class MainDbContext : DbContext
    {
        public DbSet<ExceptionLog> ExceptionLog { get; set; }
        public DbSet<Musteri> Musteri { get; set; }
        public DbSet<Urun> Urun { get; set; }
        public DbSet<Teklif> Teklif { get; set; }
        public DbSet<Category> Kategori { get; set; }
        public string DbPath { get; }

        public MainDbContext(DbContextOptions<MainDbContext> options) : base(options)
        {
            var folder = Environment.SpecialFolder.MyDocuments;
            var path = Environment.GetFolderPath(folder);
            DbPath = System.IO.Path.Join(path, "database.db");
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite($"Data Source={DbPath}");
        }
    }
}