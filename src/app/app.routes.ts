import { Routes } from '@angular/router';
import { FormPageComponent } from './pages/form-page/form-page.component';
import { ImagePageComponent } from './pages/image-page/image-page.component';

export const routes: Routes = [
  { path: '', component: FormPageComponent },
  { path: 'image', component: ImagePageComponent }
];
