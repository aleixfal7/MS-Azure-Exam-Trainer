import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamEngineService, ExamMode } from '../../services/exam-engine.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-exam-config',
  standalone: true,
  template: `
    <div class="exam-container animate-fade-in mt-4">
      <button (click)="goBack()" class="btn-outline" style="align-self: flex-start; border: none; background: transparent; padding: 0;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Volver al Catálogo
      </button>

      <div class="mb-6">
        <h1 class="page-title" style="text-align: left; font-size: 2.25rem;">Entrenamiento <span style="color: var(--azure-400);">{{ examId }}</span></h1>
        <p class="page-subtitle" style="text-align: left; font-size: 1.125rem;">Configura tu sesión de estudio.</p>
      </div>

      <div class="card-grid">
        
        <!-- Random Mode -->
        <div 
          (click)="startMode('ALL_RANDOM')"
          class="feature-card" style="padding: 2rem;">
          <div class="card-icon" style="color: var(--azure-400); background: rgba(0, 120, 212, 0.1); border-color: rgba(0, 120, 212, 0.2); width: 4rem; height: 4rem; margin-bottom: 1.5rem;">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>
          </div>
          <h2 class="card-title">Simulación Completa</h2>
          <p class="card-desc">Realiza preguntas aleatorias de toda la base de datos de este examen. Ideal para evaluar tu nivel global.</p>
          <div class="link-text">
             Iniciar Simulación <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>
        </div>

        <!-- Failure Mode -->
        <div 
          (click)="startMode('REVIEW_ERRORS')"
          class="feature-card card-error" style="padding: 2rem;">
          <div class="card-icon" style="color: var(--rose-400); background: rgba(244, 63, 94, 0.1); border-color: rgba(244, 63, 94, 0.2); width: 4rem; height: 4rem; margin-bottom: 1.5rem;">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
          </div>
          <h2 class="card-title flex items-center justify-between">
            Repaso de Errores
            <span class="card-badge badge-error">{{ failedCount }} para repasar</span>
          </h2>
          <p class="card-desc">Céntrate exclusivamente en las preguntas que has fallado en el pasado. Si las aciertas ahora, desaparecerán de esta lista.</p>
          <div class="link-text error">
             Iniciar Repaso <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </div>
        </div>

      </div>
    </div>
  `
})
export class ExamConfigComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private engine = inject(ExamEngineService);
  private auth = inject(AuthService);

  examId = '';
  failedCount = 0;

  async ngOnInit() {
    this.examId = this.route.snapshot.paramMap.get('id') || 'SC-400';
    const fails = await this.auth.getFailedQuestions(this.examId);
    this.failedCount = fails.length;
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  async startMode(mode: ExamMode) {
    if (mode === 'REVIEW_ERRORS' && this.failedCount === 0) {
      alert('¡No tienes errores pendientes para este examen!');
      return;
    }

    const success = await this.engine.startExamSession(this.examId, mode);
    if (success) {
      this.router.navigate(['/exam', this.examId, 'test']);
    } else {
      alert('Error cargando el examen.');
    }
  }
}
