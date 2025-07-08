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
  paramImg = 'assets/ParametreStatic.png';
  sendArrowImg = 'assets/flecheDroiteStatic.png';

  constructor(private router: Router) {}

  async sendToApi() {
    this.loading = true;
    this.error = '';
    try {
      // Remplace l'URL par celle de ton API
      const response = await fetch('https://api.example.com/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: this.userInput })
      });
      if (!response.ok) throw new Error('Erreur API');
      const data = await response.json();
      // Stocke l'URL de l'image dans le localStorage (ou autre méthode de partage)
      localStorage.setItem('imageUrl', data.imageUrl);
      this.router.navigate(['/image']);
    } catch (e: any) {
      this.error = e.message || 'Erreur inconnue';
    } finally {
      this.loading = false;
    }
  }

  onParamHover() {
    this.paramImg = 'assets/ParametreAnim.gif';
  }

  onParamLeave() {
    this.paramImg = 'assets/ParametreStatic.png';
  }

  onSendHover() {
    this.sendArrowImg = 'assets/flecheDroiteAnime.gif';
  }

  onSendLeave() {
    this.sendArrowImg = 'assets/flecheDroiteStatic.png';
  }
}
