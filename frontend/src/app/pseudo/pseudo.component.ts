import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  redirectUrl: string = '/home';

  constructor(private sessionService: SessionService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    
    this.route.queryParams.subscribe((params) => {
      this.redirectUrl = params['redirect'] || '/home';
    });

    if (this.sessionService.getPseudo()) {
      this.router.navigate([this.redirectUrl]);
    }
  }
  
  savePseudo(): void {
    if (this.pseudo.trim()) {
      this.sessionService.setPseudo(this.pseudo);
      this.router.navigate([this.redirectUrl]);
    }
  }

}
