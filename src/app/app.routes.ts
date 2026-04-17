import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

const authGuard = () => {
  const auth = inject(AuthService);
  return auth.currentUser() != null || !!localStorage.getItem('mock_user');
};

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  { 
    path: '', 
    loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'home', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
      { path: 'exam/:id/config', loadComponent: () => import('./pages/exam-config/exam-config').then(m => m.ExamConfigComponent) },
      { path: 'exam/:id/test', loadComponent: () => import('./pages/exam-test/exam-test').then(m => m.ExamTestComponent) }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
