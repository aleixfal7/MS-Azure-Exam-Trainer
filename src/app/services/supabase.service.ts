import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private _currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
    this.supabase.auth.onAuthStateChange((event, session) => {
      this._currentUser.next(session?.user ?? null);
    });
  }

  get currentUser$(): Observable<User | null> {
    return this._currentUser.asObservable();
  }

  get currentUser(): User | null {
    return this._currentUser.value;
  }

  async signInWithAzure(): Promise<void> {
    await this.supabase.auth.signInWithOAuth({
      provider: 'azure',
    });
  }

  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  // user_progress table interactions based on SC-400 db schema
  async getFailedQuestions(examId: string = 'SC-400'): Promise<string[]> {
    if (!this.currentUser) return [];
    
    const { data, error } = await this.supabase
      .from('user_progress')
      .select('failed_questions')
      .eq('id', this.currentUser.id)
      .eq('current_exam', examId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching data', error);
      return [];
    }

    // Default to empty array if no record or empty jsonb
    const questions = data?.failed_questions || [];
    return Array.isArray(questions) ? questions : [];
  }

  async logFailedQuestion(examId: string, questionId: string): Promise<void> {
    if (!this.currentUser) return;
    
    const currentFailed = await this.getFailedQuestions(examId);
    if (!currentFailed.includes(questionId)) {
      currentFailed.push(questionId);
      await this.updateFailedQuestions(examId, currentFailed);
    }
  }

  async logCorrectQuestion(examId: string, questionId: string): Promise<void> {
    if (!this.currentUser) return;
    
    const currentFailed = await this.getFailedQuestions(examId);
    const updatedFailed = currentFailed.filter(id => id !== questionId);
    
    if (currentFailed.length !== updatedFailed.length) {
      await this.updateFailedQuestions(examId, updatedFailed);
    }
  }

  private async updateFailedQuestions(examId: string, failedQuestions: string[]): Promise<void> {
    const { error } = await this.supabase
      .from('user_progress')
      .upsert({ 
        id: this.currentUser!.id, 
        current_exam: examId,
        failed_questions: failedQuestions,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.error('Error updating progress', error);
    }
  }
}
