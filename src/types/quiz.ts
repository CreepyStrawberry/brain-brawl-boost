export interface QuizOption {
  label: string;
  text: string;
}

export type QuestionType = 'normal' | 'media';

export interface MediaAttachment {
  url: string;
  type: 'image' | 'audio' | 'video';
  isBlurred?: boolean; // For initial blurred image
}

export interface Question {
  id: string;
  questionText: string;
  options: QuizOption[];
  correctAnswer: string;
  points: number;
  explanation?: string;
  questionType: QuestionType;
  mediaAttachments?: MediaAttachment[]; // Up to 2 media files
  timeLimit?: number; // Custom time limit in seconds (default 60)
}

export interface Round {
  id: string;
  name: string;
  theme: string;
  questions: Question[];
}

export type SlideType = 'home' | 'rounds' | 'question' | 'correct' | 'wrong' | 'complete' | 'editor' | 'round-complete';

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
