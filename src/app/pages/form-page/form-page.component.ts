import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-page.component.html',
  styleUrl: './form-page.component.css'
})
export class FormPageComponent {
  userInput = '';
  loading = false;
  error = '';
  sendArrowImg = 'assets/flecheDroiteStatic.png';
  homeImg = 'assets/AcceuilStatic.png';

  constructor(private router: Router) {}

  async sendToApi() {
    // On stocke juste le prompt et on navigue vers /image
    localStorage.setItem('comicPrompt', this.userInput);
    this.router.navigate(['/image']);
  }

  onSendHover() {
    this.sendArrowImg = 'assets/flecheDroiteAnime.gif';
  }

  onSendLeave() {
    this.sendArrowImg = 'assets/flecheDroiteStatic.png';
  }

  onHomeHover() {
    this.homeImg = 'assets/AcceuilAnime.gif';
  }

  onHomeLeave() {
    this.homeImg = 'assets/AcceuilStatic.png';
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}
