import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  imports: [

  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  constructor(private router: Router) {}
    
  startGame() {
    this.router.navigate(['/game']);
  }
}
