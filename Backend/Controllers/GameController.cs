using Microsoft.AspNetCore.Mvc;
using BackendJeuClic.Data;
using BackendJeuClic.Models;
using Microsoft.EntityFrameworkCore;

namespace BackendJeuClic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GameController(AppDbContext context)
        {
            _context = context;
        }

        // Enregistrer une partie (GAMEH)
        [HttpPost("save")]
        public async Task<IActionResult> SaveGame([FromBody] GameH game)
        {
            if (game == null)
                return BadRequest("Données invalides");

            // Ajouter l'enregistrement dans GAMEH
            _context.GameH.Add(game);
            await _context.SaveChangesAsync();

            // Retourner l'ID de la partie enregistrée
            return Ok(new { gameId = game.Id, message = "Partie enregistrée avec succès !" });
        }

        // Enregistrer chaque clic dans GAMED
        [HttpPost("save-click")]
        public async Task<IActionResult> SaveClick([FromBody] GameD gameD)
        {
            if (gameD == null)
                return BadRequest("Données invalides");

            // Ajouter l'enregistrement dans GAMED
            _context.GameD.Add(gameD);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Clic enregistré avec succès !" });
        }

        // Mettre à jour l'enregistrement de GAMEH avec le meilleur temps et le temps moyen
        [HttpPut("update-game/{gameId}")]
        public async Task<IActionResult> UpdateGame([FromRoute] int gameId, [FromBody] GameH updatedGame)
        {
            if (updatedGame == null)
                return BadRequest("Données invalides");

            // Rechercher la partie à mettre à jour
            var gameToUpdate = await _context.GameH.FindAsync(gameId);
            if (gameToUpdate == null)
                return NotFound("Partie non trouvée");

            // Mettre à jour les champs de GAMEH
            gameToUpdate.MeilleurChrono = updatedGame.MeilleurChrono;
            gameToUpdate.MoyenneChronos = updatedGame.MoyenneChronos;

            // Sauvegarder les modifications dans GAMEH
            await _context.SaveChangesAsync();

            return Ok(new { message = "Partie mise à jour avec succès !" });
        }

        // Récupérer toutes les parties (scores)
        [HttpGet("scores")]
        public async Task<IActionResult> GetScores()
        {
            var scores = await _context.GameH.OrderBy(g => g.MoyenneChronos).ToListAsync();
            return Ok(scores);
        }

        // Test de la connexion à la base de données
        [HttpGet("test-connection")]
        public async Task<IActionResult> TestConnection()
        {
            try
            {
                // Essaye d'exécuter une simple requête pour vérifier la connexion
                var canConnect = _context.Database.CanConnect();

                if (!canConnect)
                {
                    return StatusCode(500, "Impossible de se connecter à la base de données.");
                }

                // Récupérer le contenu de la table GAMEH
                var gamehData = await _context.GameH.ToListAsync();

                return Ok(new { message = "Connexion réussie", gamehData = gamehData });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur de connexion à la base de données : {ex.Message}");
            }
        }

        [HttpGet("all-games")]
        public async Task<IActionResult> GetAllGames()
        {
            var games = await _context.GameH.Where(g => g.MeilleurChrono > 0).ToListAsync();
            return Ok(games);
        }

        // Récupérer tous les clics d'une partie spécifique
        [HttpGet("clicks/{gameId}")]
        public async Task<IActionResult> GetClicksByGameId(int gameId)
        {
            var clicks = await _context.GameD.Where(d => d.GameId == gameId).ToListAsync();

            if (!clicks.Any())
                return NotFound($"Aucun clic trouvé pour la partie avec l'ID {gameId}");

            return Ok(clicks);
        }
        
        // Récupérer toutes les parties d'un utilisateur via son pseudo
        [HttpGet("games-by-user/{pseudo}")]
        public async Task<IActionResult> GetGamesByPseudo(string pseudo)
        {
            var games = await _context.GameH.Where(g => g.Pseudo == pseudo && g.MeilleurChrono > 0).ToListAsync();

            if (!games.Any())
                return NotFound($"Aucune partie trouvée pour l'utilisateur {pseudo}");

            return Ok(games);
        }
    }
}
