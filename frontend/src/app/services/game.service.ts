import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:5178/api/game'; // URL de base de l'API
  private configUrl = 'assets/config.json';
  private maxClicks = 5;
  private times: number[] = [];

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<any> {
    return this.http.get(this.configUrl);
  }



  setMaxClicks(value: number) {
    this.maxClicks = value;
  }

  getMaxClicks(): number {
    return this.maxClicks;
  }

  addClickTime(time: number) {
    this.times.push(time);
  }

  getTimes(): number[] {
    return this.times;
  }

  resetGame() {
    this.times = [];
  }

  getAllGames(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all-games`);
  }
  
  
  getClicksByGameId(gameId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/clicks/${gameId}`);
  }


  getGamesByUser(pseudo: string): Observable<any> {
    
    return this.http.get<any>(`${this.apiUrl}/games-by-user/${pseudo}`);
  }

  // Sauvegarder une nouvelle partie (GAMEH)
  saveGameResult(gameData: any): Observable<any> {
    //console.log(gameData)
    return this.http.post<any>(`${this.apiUrl}/save`, gameData);
  }
  
  // Enregistrer chaque clic (GAMED)
  saveClickData(clickData: any): Observable<any> {
    //console.log(clickData);
    return this.http.post<any>(`${this.apiUrl}/save-click`, clickData);
  }

  // Mettre à jour les informations de la partie (GAMEH)
  updateGameResult(gameData: any): Observable<any> {
    //console.log(gameData)
    return this.http.put<any>(`${this.apiUrl}/update-game/${gameData.gameId}`, gameData);
  }
}
