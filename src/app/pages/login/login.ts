import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="screen-container center-content login-bg">
      <div class="ambient-glow"></div>

      <div class="animate-fade-in-up" style="z-index: 10; width: 100%; max-width: 28rem;">
        
        <div class="text-center mb-6">
          <div class="brand-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <h1 class="page-title">Portal de Exámenes</h1>
          <p class="page-subtitle">Entrenamiento avanzado para Microsoft Purview</p>
        </div>

        <div class="glass-card">
          <h2 class="section-title">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--azure-500);"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
             Acceso Plataforma
          </h2>
          
          <button 
            (click)="doLogin()"
            [disabled]="loading()"
            class="btn-primary">
            @if (loading()) {
              <svg class="spin" style="width:20px;height:20px;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Autenticando...
            } @else {
              Entrar con Modo Simulado
            }
          </button>
          
          <div class="text-center mt-4" style="opacity: 0.6; font-size: 0.75rem;">
            <p>Al acceder, la aplicación recordará tu progreso y tus fallos para la sesión de estudio.</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  auth = inject(AuthService);
  loading = signal(false);

  async doLogin() {
    this.loading.set(true);
    await this.auth.loginSimulated();
  }
}
