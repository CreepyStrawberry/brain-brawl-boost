export interface QuizOption {
  label: string;
  text: string;
}

export interface Question {
  id: string;
  questionText: string;
  options: QuizOption[];
  correctAnswer: string;
  points: number;
  explanation?: string;
}

export interface Round {
  id: string;
  name: string;
  theme: string;
  questions: Question[];
}

export type SlideType = 'home' | 'rounds' | 'question' | 'correct' | 'wrong' | 'complete' | 'editor';

export interface QuizState {
  rounds: Round[];
  currentRoundIndex: number;
  currentQuestionIndex: number;
  currentSlide: SlideType;
  score: number;
  correctAnswers: number;
  answerRevealed: boolean;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  showCelebration: boolean;
  timerRunning: boolean;
  timeRemaining: number;
  isEditMode: boolean;
}
