import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { SessionService } from '../services/session.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports: [
    CommonModule
  ]
})
export class GameComponent implements OnInit, AfterViewInit {
  imageSrc = '';
  position = { top: '50%', left: '50%' };
  startTime!: number;
  clickCount = 0;
  maxClicks!: number;
  imageList = ['1.jpg', '2.jpg', '3.jpg']; 
  imageSize = 150;
  windowHeight = window.innerHeight;
  windowWidth = window.innerWidth;
  isGameStarted = false; // Permet de cacher le header
  
  preloadedImages: string[] = []; // Stocke les images préchargées

  gameId: any;
  gameResults: any= { // Déclarer et initialiser gameResults
    bestTime: Infinity,  // Le meilleur temps est initialement très élevé
    totalTime: 0,        // Le temps total commence à zéro
    clickTimes: []       // Tableau vide pour les temps des clics
  };
  constructor(private gameService: GameService,private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    //this.testRequests()
    
    if (!this.sessionService.getPseudo()) {
      this.router.navigate(['/pseudo']);
      return;
    }

    this.gameService.loadConfig().subscribe(config => {
      this.maxClicks = config.maxClicks;
      this.preloadImages();
      this.loadFirstImage();
     
    });
  }

  preloadImages(): void {
    this.preloadedImages = this.imageList.map(img => `images/${img}`);
    this.preloadedImages.forEach(src => {
      const img = new Image();
      img.src = src; // Force le chargement en cache
    });
  }

  ngAfterViewInit(): void {
    this.scrollToGame();
  }
  
  loadFirstImage(): void {
    this.imageSrc = this.preloadedImages[Math.floor(Math.random() * this.preloadedImages.length)];
  }

  startGame(): void {
    this.isGameStarted = true;
    this.enterFullscreen();
    this.scrollToGame();
    this.startTime = performance.now();

    this.gameResults = {
      bestTime: Infinity, // Le meilleur temps est initialement très élevé
      totalTime: 0,       // Le temps total commence à zéro
      clickTimes: []      // Un tableau vide pour stocker les temps des clics
    };
    
    const gameData = {
      pseudo: this.sessionService.getPseudo(),
      date: new Date(),
      MeilleurChrono: 0,
      MoyenneChronos: 0
    };
    
    this.gameService.saveGameResult(gameData).subscribe(response => {
      this.gameId = response.gameId;  // Récupérer l'ID de la partie
    });
  }

  testRequests(): void {
    
    this.gameService.getAllGames().subscribe(
      data => console.log('Toutes les parties:', data),
      error => console.error('Erreur getAllGames:', error)
    );

    
    this.gameService.getClicksByGameId(19).subscribe(
      data => console.log('Clics de la partie 16:', data),
      error => console.error('Erreur getClicksByGameId:', error)
    );

   
    this.gameService.getGamesByUser('zeferzfg').subscribe(
      data => console.log('Parties de Player1:', data),
      error => console.error('Erreur getGamesByUser:', error)
    );
  }
  
  enterFullscreen(): void {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    }
  }

  scrollToGame(): void {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 300);
  }

  onClick(): void {
    if (!this.isGameStarted) {
      this.startGame(); // Démarre le jeu au premier clic
      return;
    }
   
    const currentTime = performance.now();
    const elapsedTime = currentTime - this.startTime;
  
    // Ajouter le clic au tableau des temps
    this.gameResults.clickTimes.push(elapsedTime);
    
    // Enregistrer le clic dans GAMED
    const clickData = {
      gameId: this.gameId,
      NumeroClic: this.clickCount + 1,
      chrono: elapsedTime
    };
  
    this.gameService.saveClickData(clickData).subscribe();  // Enregistre chaque clic
  
    // Mise à jour du meilleur temps et du temps total
    if (elapsedTime < this.gameResults.bestTime) {
      this.gameResults.bestTime = elapsedTime;
    }
  
    this.gameResults.totalTime += elapsedTime;
    this.startTime = currentTime;
  
    this.clickCount++;
    if (this.clickCount >= this.maxClicks) {
      this.exitFullscreen();
      
      // Mettre à jour la ligne de GAMEH après tous les clics
      const gameUpdateData = {
        gameId: this.gameId,
        MeilleurChrono: this.gameResults.bestTime,
        MoyenneChronos: this.gameResults.totalTime / this.clickCount,
        pseudo: this.sessionService.getPseudo(),
      };
      
      this.gameService.updateGameResult(gameUpdateData).subscribe(() => {
        this.router.navigate(['/game-results'], { queryParams: { gameId: this.gameId } });
      });
      
    } else {
      this.moveImage();
    }
  }
  

  moveImage(): void {
    const randomIndex = Math.floor(Math.random() * this.preloadedImages.length);
    this.imageSrc = this.preloadedImages[randomIndex];

    // Calculer la position pour que l'image reste bien visible
    const maxTop = this.windowHeight - this.imageSize - 20;
    const maxLeft = this.windowWidth - this.imageSize - 20;

    this.position = {
      top: `${Math.random() * maxTop}px`,
      left: `${Math.random() * maxLeft}px`
    };
  }

  exitFullscreen(): void {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.windowHeight = window.innerHeight;
    this.windowWidth = window.innerWidth;
  }
}
