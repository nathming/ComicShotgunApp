import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NgIf],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {
  showInfo = false;
  constructor(private router: Router) {}
  goToForm() {
    this.router.navigate(['/form']);
  }
  toggleInfo() {
    this.showInfo = !this.showInfo;
  }
}
