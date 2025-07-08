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

  ngOnInit() {
    this.imageUrl = localStorage.getItem('imageUrl') || '';
  }
}
