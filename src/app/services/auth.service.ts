import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Simulated Auth State
  currentUser = signal<{id: string, name: string} | null>(null);

  // Simulated Database for User Progress (In Memory for now)
  // exam_id -> set of failed question ids
  private simulatedFailedQuestions = new Map<string, Set<string>>();

  constructor(private router: Router) {
    // Check local storage for simulated session
    const stored = localStorage.getItem('mock_user');
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    }
  }

  async loginSimulated() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = { id: 'usr_123', name: 'Consultor Seguridad' };
    this.currentUser.set(user);
    localStorage.setItem('mock_user', JSON.stringify(user));
    
    // Simulate pre-existing failed questions for demonstration
    this.simulatedFailedQuestions.set('SC-400', new Set(['QUESTION 8']));
    
    this.router.navigate(['/home']);
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('mock_user');
    this.router.navigate(['/']);
  }

  async getFailedQuestions(examId: string): Promise<string[]> {
    return Array.from(this.simulatedFailedQuestions.get(examId) || []);
  }

  async logFailedQuestion(examId: string, questionId: string) {
    if (!this.simulatedFailedQuestions.has(examId)) {
      this.simulatedFailedQuestions.set(examId, new Set());
    }
    this.simulatedFailedQuestions.get(examId)!.add(questionId);
  }

  async logCorrectQuestion(examId: string, questionId: string) {
    const set = this.simulatedFailedQuestions.get(examId);
    if (set) {
      set.delete(questionId);
    }
  }
}
