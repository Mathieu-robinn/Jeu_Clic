using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackendJeuClic.Models
{
    public class GameD
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("GameH")]
        [Column("game_id")]
        public int GameId { get; set; }
        
        [Column("numero_clic")]
        public int NumeroClic { get; set; }
        
        [Column("chrono")]
        public float Chrono { get; set; }
    }
}
