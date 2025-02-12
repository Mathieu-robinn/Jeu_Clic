import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { SessionService } from './services/session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  constructor(private sessionService: SessionService, private router: Router) {}
  ngOnInit(): void {
    if (!this.sessionService.getPseudo()) {
      this.router.navigate(['/pseudo']);
    }
  }
}