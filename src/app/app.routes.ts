import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: 'home', loadComponent: () => import('./components/home/home.component').then(comp => comp.HomeComponent) },
    { path: 'login', loadComponent: () => import('./components/login/login.component').then(comp => comp.LoginComponent) },
    { path: '**', component: NotFoundComponent }
];
