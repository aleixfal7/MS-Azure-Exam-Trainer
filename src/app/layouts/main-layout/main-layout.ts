import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="screen-container">
      <nav class="navbar">
        <div class="navbar-container">
          
          <div class="nav-brand" onclick="window.location.href='/home'">
            <div class="nav-logo">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <div class="nav-title desktop-only">
              Portal de Exámenes <span>| Entrenamiento</span>
            </div>
            <div class="nav-title mobile-only">
              Portal
            </div>
          </div>

          <div class="flex items-center gap-3">
            @if (auth.currentUser(); as user) {
              <div class="desktop-only" style="flex-direction: column; align-items: flex-end; margin-right: 0.5rem;">
                <span style="font-size: 0.875rem; font-weight: 600; color: var(--slate-200);">{{ user.name }}</span>
                <span style="font-size: 0.75rem; color: var(--azure-400);">Consultor Activo</span>
              </div>
              <button (click)="auth.logout()" title="Cerrar sesión" class="btn-outline" style="width: 2.25rem; height: 2.25rem; padding: 0; display:flex; align-items:center; justify-content:center; border-radius: 50%;">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              </button>
            }
          </div>

        </div>
      </nav>

      <main class="main-content">
         <div class="ambient-glow" style="right: 0; left: auto; top: 0;"></div>
         <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class MainLayoutComponent {
  auth = inject(AuthService);
}
