import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamEngineService } from '../../services/exam-engine.service';
import { signal } from '@angular/core';

@Component({
  selector: 'app-exam-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (engine.currentQuestion(); as q) {
      <div class="exam-container animate-fade-in">
        
        <!-- Header -->
        <div class="exam-header">
          <div class="flex items-center gap-3">
            <button (click)="quit()" class="btn-outline mr-2" style="border:none; padding:0; justify-content:center;">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </button>
            <span class="exam-badge flex items-center gap-2">
              {{ engine.activeExamId() }} [{{ isEnglish() ? 'EN' : 'ES' }}]
            </span>
            <span class="exam-counter">
               Pregunta {{ engine.currentIndex() + 1 }} de {{ engine.totalQuestions() }}
            </span>
          </div>

          <button 
            (click)="toggleLanguage()"
            class="btn-outline desktop-only">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/></svg>
            {{ isEnglish() ? 'Ver Traducida' : 'Ver Original' }}
          </button>
        </div>

        <button 
            (click)="toggleLanguage()"
            class="btn-outline mobile-only mb-6 w-full" style="justify-content: center; padding: 0.75rem;">
            Cambiar Idioma (EN/ES)
        </button>

        <!-- Question Card -->
        <div class="question-box" style="position: relative; overflow: hidden;">
          <div class="ambient-glow" style="top: 0; right: 0; width: 300px; height: 300px;"></div>
          
          <h2 class="question-text" style="position: relative; z-index: 10;">
            {{ isEnglish() ? q.text : (q.translation_es || q.text) }}
          </h2>
        </div>

        <!-- Options grid -->
        <div class="options-list">
          @for (option of q.options; track option; let i = $index) {
            <button [class]="getOptionClass(i)" (click)="selectOption(i)">
              <div class="option-icon">
                {{ option.charAt(0) }}
              </div>
              <span class="option-text">{{ option.substring(3) }}</span>
            </button>
          }
        </div>

        <!-- Actions & Explanation -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem;">
          @if (isValidated()) {
            <div class="explanation-box animate-fade-in-up">
              <div [class]="getExplanationIconClass(q)">
                  @if (selectedOptionIndex() !== null && q.options[selectedOptionIndex()!].charAt(0) === q.answer) {
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  }
              </div>
              <div>
                <h3 class="expl-title">Explicación Oficial</h3>
                <p class="expl-text">
                  {{ q.explanation }}
                </p>
              </div>
            </div>
          }

          <div class="exam-actions">
             @if (!isValidated()) {
                <button 
                  (click)="validate()"
                  [disabled]="selectedOptionIndex() === null"
                  class="btn-primary" style="width: auto; padding-left: 2rem; padding-right: 2rem;">
                  Validar Respuesta
                </button>
              } @else {
                <button 
                  (click)="nextQuestion()"
                  class="btn-secondary" style="width: auto;">
                  {{"Siguiente Pregunta"}}
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              }
          </div>
        </div>

      </div>
    } @else {
      <div class="finish-container animate-fade-in">
        <div class="finish-icon">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 class="finish-title">¡Sesión Terminada!</h2>
        <p class="finish-desc">Has llegado al final de esta tanda de preguntas.</p>
        <button (click)="quit()" class="btn-primary" style="width: auto; padding-left: 2rem; padding-right: 2rem;">Volver al Portal</button>
      </div>
    }
  `
})
export class ExamTestComponent {
  public engine = inject(ExamEngineService);
  private router = inject(Router);

  selectedOptionIndex = signal<number | null>(null);
  isValidated = signal(false);
  isEnglish = signal(true); 

  quit() {
    this.router.navigate(['/home']);
  }

  selectOption(index: number) {
    if (this.isValidated()) return;
    this.selectedOptionIndex.set(index);
  }

  validate() {
    if (this.selectedOptionIndex() === null) return;
    this.isValidated.set(true);
    
    const currentQ = this.engine.currentQuestion();
    if (currentQ) {
       const selectedText = currentQ.options[this.selectedOptionIndex()!];
       const selectedLetter = selectedText.charAt(0);
       const isCorrect = selectedLetter === currentQ.answer;
       this.engine.processAnswer(currentQ.id, isCorrect);
    }
  }

  nextQuestion() {
    this.selectedOptionIndex.set(null);
    this.isValidated.set(false);
    this.engine.nextQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleLanguage() {
    this.isEnglish.update(v => !v);
  }

  getOptionClass(index: number): string {
    const isSelected = this.selectedOptionIndex() === index;
    let cls = 'option-btn ';
    
    if (isSelected && !this.isValidated()) cls += 'selected ';
    if (this.isValidated()) {
      cls += 'validated ';
      const q = this.engine.currentQuestion();
      if (q) {
        const optionLetter = q.options[index].charAt(0);
        const isCorrectAnswer = optionLetter === q.answer;
        
        if (isCorrectAnswer) {
           cls += 'correct ';
           if (isSelected) cls += 'selected ';
        } else if (isSelected && !isCorrectAnswer) {
           cls += 'wrong selected ';
        } else {
           cls += 'disabled ';
        }
      }
    }
    return cls.trim();
  }

  getExplanationIconClass(q: any): string {
     let isCorrect = false;
     if (this.selectedOptionIndex() !== null) {
       isCorrect = q.options[this.selectedOptionIndex()!].charAt(0) === q.answer;
     }
     return 'expl-icon ' + (isCorrect ? 'correct' : 'wrong');
  }
}
