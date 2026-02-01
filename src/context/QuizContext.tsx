import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Question {
  id: string;
  roundName: string;
  questionText: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  points: number;
  explanation?: string;
}

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  currentSlide: 'home' | 'question' | 'complete';
  score: number;
  correctAnswers: number;
  answerRevealed: boolean;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  showCelebration: boolean;
  timerRunning: boolean;
  timeRemaining: number;
}

interface QuizContextType extends QuizState {
  setQuestions: (questions: Question[]) => void;
  selectAnswer: (answer: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToSlide: (slide: QuizState['currentSlide']) => void;
  resetQuestion: () => void;
  startQuiz: () => void;
  resetQuiz: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (seconds?: number) => void;
  setTimeRemaining: (time: number) => void;
  updateQuestion: (index: number, question: Question) => void;
}

const defaultQuestions: Question[] = [
  {
    id: '1',
    roundName: 'Networking Basics',
    questionText: 'Which protocol is specifically utilized for facilitating secure web browsing by encrypting the communication between the client\'s browser and the web server via SSL/TLS?',
    options: [
      { label: 'A', text: 'HTTP (Hypertext Transfer Protocol)' },
      { label: 'B', text: 'FTP (File Transfer Protocol)' },
      { label: 'C', text: 'HTTPS (Hypertext Transfer Protocol Secure)' },
      { label: 'D', text: 'SSH (Secure Shell Protocol)' },
    ],
    correctAnswer: 'C',
    points: 10,
    explanation: 'HTTPS is the correct standard for secure web communication by wrapping HTTP in SSL/TLS encryption.',
  },
  {
    id: '2',
    roundName: 'Networking Basics',
    questionText: 'In the OSI model, which layer is responsible for routing data packets between different networks?',
    options: [
      { label: 'A', text: 'Data Link Layer (Layer 2)' },
      { label: 'B', text: 'Network Layer (Layer 3)' },
      { label: 'C', text: 'Transport Layer (Layer 4)' },
      { label: 'D', text: 'Session Layer (Layer 5)' },
    ],
    correctAnswer: 'B',
    points: 10,
  },
  {
    id: '3',
    roundName: 'Cybersecurity',
    questionText: 'What type of attack involves an attacker intercepting communication between two parties without their knowledge?',
    options: [
      { label: 'A', text: 'DDoS Attack' },
      { label: 'B', text: 'Phishing Attack' },
      { label: 'C', text: 'Man-in-the-Middle Attack' },
      { label: 'D', text: 'SQL Injection' },
    ],
    correctAnswer: 'C',
    points: 20,
  },
];

const QuizContext = createContext<QuizContextType | null>(null);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState<QuizState['currentSlide']>('home');
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);

  const selectAnswer = useCallback((answer: string) => {
    if (answerRevealed) return;
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setAnswerRevealed(true);
    setTimerRunning(false);
    
    if (correct) {
      setScore(prev => prev + currentQuestion.points);
      setCorrectAnswers(prev => prev + 1);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
  }, [answerRevealed, questions, currentQuestionIndex]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswerRevealed(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowCelebration(false);
      setTimeRemaining(60);
      setTimerRunning(false);
    } else {
      setCurrentSlide('complete');
    }
  }, [currentQuestionIndex, questions.length]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setAnswerRevealed(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowCelebration(false);
      setTimeRemaining(60);
      setTimerRunning(false);
    }
  }, [currentQuestionIndex]);

  const goToSlide = useCallback((slide: QuizState['currentSlide']) => {
    setCurrentSlide(slide);
  }, []);

  const startQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setAnswerRevealed(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeRemaining(60);
    setTimerRunning(false);
    setCurrentSlide('question');
  }, []);

  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setAnswerRevealed(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeRemaining(60);
    setTimerRunning(false);
    setCurrentSlide('home');
  }, []);

  const resetQuestion = useCallback(() => {
    setAnswerRevealed(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowCelebration(false);
    setTimeRemaining(60);
    setTimerRunning(false);
  }, []);

  const startTimer = useCallback(() => {
    setTimerRunning(true);
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerRunning(false);
  }, []);

  const resetTimer = useCallback((seconds = 60) => {
    setTimeRemaining(seconds);
    setTimerRunning(false);
  }, []);

  const updateQuestion = useCallback((index: number, question: Question) => {
    setQuestions(prev => {
      const newQuestions = [...prev];
      newQuestions[index] = question;
      return newQuestions;
    });
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        currentQuestionIndex,
        currentSlide,
        score,
        correctAnswers,
        answerRevealed,
        selectedAnswer,
        isCorrect,
        showCelebration,
        timerRunning,
        timeRemaining,
        setQuestions,
        selectAnswer,
        nextQuestion,
        previousQuestion,
        goToSlide,
        resetQuestion,
        startQuiz,
        resetQuiz,
        startTimer,
        pauseTimer,
        resetTimer,
        setTimeRemaining,
        updateQuestion,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
