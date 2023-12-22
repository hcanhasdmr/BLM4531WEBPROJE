using Microsoft.EntityFrameworkCore;
using webapi.Entity;

namespace webapi.Entity
{
    public class Context : DbContext
    {
        public DbSet<Category> Kategori { get; set; }
        public DbSet<Musteri> Musteri { get; set; }
        public DbSet<Teklif> Teklif { get; set; }
        public DbSet<TeklifItem> TeklifItem { get; set; }
        public DbSet<Urun> Urun { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlite("Data Source =database.db");
        }
    }

}