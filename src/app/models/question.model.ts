export interface Question {
  id: string; // e.g. "QUESTION 7"
  type: string;
  text: string;
  options: string[];
  answer: string;
  explanation: string;
  translation_es?: string;
}

export interface ExamDataset {
  exam_id: string;
  lang: string;
  questions: Question[];
}
