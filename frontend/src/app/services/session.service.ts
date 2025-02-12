import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly PSEUDO_KEY = 'userPseudo';
  private pseudoSubject = new BehaviorSubject<string | null>(this.getPseudo());

  pseudo$ = this.pseudoSubject.asObservable();

  constructor() {}

  setPseudo(pseudo: string): void {
    sessionStorage.setItem(this.PSEUDO_KEY, pseudo);
    this.pseudoSubject.next(pseudo);
  }

  getPseudo(): string | null {
    return sessionStorage.getItem(this.PSEUDO_KEY);
  }

  clearPseudo(): void {
    sessionStorage.removeItem(this.PSEUDO_KEY);
    this.pseudoSubject.next(null);
  }
}
