import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'home' },
    { path: 'home', loadComponent: () => import('./components/main/home/home.component').then(comp => comp.HomeComponent) },
    { path: 'login', loadComponent: () => import('./auth/login/login.component').then(comp => comp.LoginComponent) },
    { path: 'register', loadComponent: () => import('./auth/register/register.component').then(comp => comp.RegisterComponent) },
    { path: '**', component: NotFoundComponent }
];
