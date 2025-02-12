using Microsoft.EntityFrameworkCore;
using BackendJeuClic.Models;

namespace BackendJeuClic.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<GameH> GameH { get; set; }
        public DbSet<GameD> GameD { get; set; }
    }
}
