import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-pseudo',
  templateUrl: './pseudo.component.html',
  styleUrls: ['./pseudo.component.css'],
  imports: [
    FormsModule
  ],
})
export class PseudoComponent implements OnInit {
  pseudo: string = '';

  constructor(private sessionService: SessionService, private router: Router) {}

  ngOnInit(): void {
    if (this.sessionService.getPseudo()) {
      this.router.navigate(['/home']);
    }
  }

  savePseudo(): void {
    if (this.pseudo.trim()) {
      this.sessionService.setPseudo(this.pseudo);
      this.router.navigate(['/home']); 
    }
  }

}
