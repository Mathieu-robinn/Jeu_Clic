using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace BackendJeuClic.Models
{
    public class GameH
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Pseudo { get; set; }

        [Column("meilleur_chrono")]
        public float MeilleurChrono { get; set; }


        [Column("moyenne_chronos")]
        public float MoyenneChronos { get; set; }

        [Column("date_heure")]
        public DateTime DateHeure { get; set; } = DateTime.Now;
    }
}
