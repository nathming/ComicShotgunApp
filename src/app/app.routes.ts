import { Routes } from '@angular/router';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { ImagePageComponent } from './pages/image-page/image-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'form', component: FormPageComponent },
  { path: 'image', component: ImagePageComponent }
];
