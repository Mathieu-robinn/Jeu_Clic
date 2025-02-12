import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { SessionService } from '../services/session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-results',
  templateUrl: './game-results.component.html',
  styleUrls: ['./game-results.component.scss'],
  imports: [CommonModule]
})
export class GameResultsComponent implements OnInit {
  gameId!: number;
  pseudo!: string;
  clicks: any[] = [];
  userGames: any[] = [];
  allGames: any[] = [];

  resultperpage: number = 10;

  // Variables pour la pagination
  currentPageUser: number = 1;
  currentPageGlobal: number = 1;

  averageTime: number = 0;
  userRanking: number = 0;
  globalRanking: number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private gameService: GameService, private sessionService: SessionService) {}

  ngOnInit(): void {
    //console.log("Début");
    
    if (!this.sessionService.getPseudo()) {
      this.router.navigate(['/pseudo']);
      return;
    }

    this.gameService.loadConfig().subscribe(config => {
      this.resultperpage = config.resultperpage;
      //console.log("Résultats par page: " + this.resultperpage);
    });

    // Récupération des paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      this.gameId = params['gameId'];
      this.pseudo = this.sessionService.getPseudo() ?? '';
      //console.log(this.gameId);
      
      this.loadResults();
    });
  }

  loadResults(): void {
    if (this.gameId) {
      this.gameService.getClicksByGameId(this.gameId).subscribe(data => {
        //console.log(data);
        this.clicks = data;
        this.averageTime = this.calculateAverageTime();
      });
    }

    this.gameService.getGamesByUser(this.pseudo).subscribe(data => {
      //console.log(data);
      this.userGames = [...data].sort((a, b) => a.moyenneChronos - b.moyenneChronos);
      this.userRanking = this.userGames.findIndex(game => game.id === this.gameId) + 1;
    });

    this.gameService.getAllGames().subscribe(data => {
      //console.log(data);
      this.allGames = [...data].sort((a, b) => a.moyenneChronos - b.moyenneChronos);
      this.globalRanking = this.allGames.findIndex(game => game.id === this.gameId) + 1;
    });
  }

  calculateAverageTime(): number {
    if (this.clicks.length === 0) return 0;
    const total = this.clicks.reduce((sum, click) => sum + click.time, 0);
    return total / this.clicks.length;
  }

  navigate(game_id: number): void {
    this.router.navigate(['/game-results'], { queryParams: { gameId: game_id } });
  }

  // Pagination des parties utilisateur
  getUserGamesPaginated(): any[] {
    const start = (this.currentPageUser - 1) * this.resultperpage;
    return this.userGames.slice(start, start + this.resultperpage);
  }

  nextPageUser(): void {
    if ((this.currentPageUser * this.resultperpage) < this.userGames.length) {
      this.currentPageUser++;
    }
  }

  prevPageUser(): void {
    if (this.currentPageUser > 1) {
      this.currentPageUser--;
    }
  }

  // Pagination des parties globales
  getAllGamesPaginated(): any[] {
    const start = (this.currentPageGlobal - 1) * this.resultperpage;
    return this.allGames.slice(start, start + this.resultperpage);
  }

  nextPageGlobal(): void {
    if ((this.currentPageGlobal * this.resultperpage) < this.allGames.length) {
      this.currentPageGlobal++;
    }
  }

  prevPageGlobal(): void {
    if (this.currentPageGlobal > 1) {
      this.currentPageGlobal--;
    }
  }
}
