import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-image-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './image-page.component.html',
  styleUrl: './image-page.component.css'
})
export class ImagePageComponent {
  imageUrl = '';
  loading = true;
  showTransition = false;
  showImage = false;

  ngOnInit() {
    // Simule l'attente de l'API (2s)
    setTimeout(() => {
      this.loading = false;
      this.showTransition = true;
      // Joue la vidéo de transition pendant 2s puis affiche l'image
      setTimeout(() => {
        this.showTransition = false;
        this.showImage = true;
        this.imageUrl = localStorage.getItem('imageUrl') || 'assets/Logo.png';
      }, 2000); // durée de la vidéo transition.mp4
    }, 2000); // durée de l'attente API simulée
  }
}
