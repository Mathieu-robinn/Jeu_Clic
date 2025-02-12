import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '../services/session.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  pseudo: string | null = null;
  
  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    this.sessionService.pseudo$.subscribe(pseudo => {
      this.pseudo = pseudo;
    });
  }
  
  logout(): void {
    this.sessionService.clearPseudo();
    this.router.navigate(['/pseudo']);
  }

  login(): void {
    this.router.navigate(['/pseudo']);
  }
}
