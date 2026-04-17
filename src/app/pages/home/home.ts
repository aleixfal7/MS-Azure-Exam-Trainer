import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="animate-fade-in">
      <div class="mb-6 mt-4">
        <h1 class="page-title" style="text-align: left;">Catálogo de Certificaciones</h1>
        <p class="page-subtitle" style="text-align: left; font-size: 1.125rem;">Selecciona el itinerario que deseas entrenar hoy.</p>
      </div>

      <div class="card-grid">
        
        <!-- SC-401 Card -->
        <div 
          (click)="selectExam('SC-401')"
          class="feature-card">
          
          <div class="ambient-glow" style="width: 15rem; height: 15rem; top:0; right:0; filter: blur(40px); background: rgba(0, 120, 212, 0.1);"></div>
          
          <div class="card-icon-wrap" style="position: relative; z-index: 10;">
            <div class="card-icon">
              <span style="font-weight: 700; font-size: 1.25rem;">SC</span>
            </div>
            <span class="card-badge badge-success">Actualizado</span>
          </div>

          <h3 class="card-title" style="position: relative; z-index: 10;">Information Protection (SC-401)</h3>
          <p class="card-desc" style="position: relative; z-index: 10;">Entrena y administra Microsoft Purview Information Protection Administrator (SC-401).</p>

          <div class="card-footer" style="position: relative; z-index: 10;">
            <span class="text-muted">Nuevo Examen</span>
            <span class="link-text">
              Entrenar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </div>
        </div>

        <!-- SC-200 Placeholder -->
        <div class="feature-card card-disabled">
          <div class="card-icon-wrap">
            <div class="card-icon" style="background: rgba(30,41,59,0.3); border-color: rgba(51,65,85,0.3); color: var(--slate-500);">
              <span style="font-weight: 700; font-size: 1.25rem;">SC</span>
            </div>
            <span class="card-badge badge-neutral">Próximamente</span>
          </div>
          <h3 class="card-title" style="color: var(--slate-300);">Security Operations</h3>
          <p class="card-desc">Microsoft Security Operations Analyst (SC-200).</p>
        </div>

      </div>
    </div>
  `
})
export class HomeComponent {
  constructor(private router: Router) {}

  selectExam(examId: string) {
    this.router.navigate(['/exam', examId, 'config']);
  }
}
