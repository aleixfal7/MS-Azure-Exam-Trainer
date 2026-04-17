import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question, ExamDataset } from '../models/question.model';
import { AuthService } from './auth.service';
import { catchError, map, Observable, of } from 'rxjs';

export type ExamMode = 'ALL_RANDOM' | 'REVIEW_ERRORS' | null;

@Injectable({
  providedIn: 'root'
})
export class ExamEngineService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  // Status
  activeExamId = signal<string | null>(null);
  activeMode = signal<ExamMode>(null);
  
  questions = signal<Question[]>([]);
  currentIndex = signal(0);
  
  // Real-time getters
  currentQuestion = computed(() => {
    const qs = this.questions();
    if (qs.length === 0 || this.currentIndex() >= qs.length) return null;
    return qs[this.currentIndex()];
  });
  
  totalQuestions = computed(() => this.questions().length);

  async startExamSession(examId: string, mode: ExamMode): Promise<boolean> {
    this.activeExamId.set(examId);
    this.activeMode.set(mode);
    this.currentIndex.set(0);

    return new Promise((resolve) => {
      this.http.get<ExamDataset>(`/assets/data/${examId.toLowerCase()}.json`).subscribe({
        next: async (dataset) => {
          let pool = [...dataset.questions];

          if (mode === 'REVIEW_ERRORS') {
            const failedIds = await this.auth.getFailedQuestions(examId);
            pool = pool.filter(q => failedIds.includes(q.id));
          } else {
            // Shuffle all
            pool = pool.sort(() => Math.random() - 0.5);
          }

          this.questions.set(pool);
          resolve(true);
        },
        error: (err) => {
          console.error('Error fetching exam dataset', err);
          this.questions.set([]);
          resolve(false);
        }
      });
    });
  }

  async processAnswer(questionId: string, isCorrect: boolean) {
    const examId = this.activeExamId();
    if (!examId) return;

    if (isCorrect) {
      await this.auth.logCorrectQuestion(examId, questionId);
    } else {
      await this.auth.logFailedQuestion(examId, questionId);
    }
  }

  nextQuestion() {
    if (this.currentIndex() < this.questions().length - 1) {
      this.currentIndex.update(v => v + 1);
    }
  }
}
