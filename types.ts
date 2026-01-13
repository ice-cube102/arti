export enum Difficulty {
  Concept = "개념",
  Normal = "보통",
  Trap = "함정",
  Hard = "어려움",
  VeryHard = "매우 어려움",
  Killer = "죽어",
  Cursed = "저주"
}

export type ExamState = 'intro' | 'exam' | 'nameInput' | 'hiddenStage' | 'result';

export type QuestionType = 'multiple-choice' | 'subjective';

export interface Question {
  id: number;
  difficulty: Difficulty;
  points: number;
  category: string;
  type: QuestionType;
  question: string;
  options?: string[]; // Optional for subjective
  correctAnswer?: number; // Index for multiple choice
  subjectiveAnswer?: string; // Answer string for subjective
  solution: string;
  hints: string[];
}