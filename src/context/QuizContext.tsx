import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { useRef, useEffect } from 'react';
import { Question, Round, SlideType, QuizState, QuestionType } from '@/types/quiz';

interface QuizContextType extends QuizState {
  // Navigation
  goToSlide: (slide: SlideType) => void;
  selectRound: (index: number) => void;
  selectQuestion: (roundIndex: number, questionIndex: number) => void;
  goToNextRound: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  
  // Quiz actions
  selectAnswer: (answer: string) => void;
  continueAfterFeedback: () => void;
  resetQuestion: () => void;
  startQuiz: () => void;
  resetQuiz: () => void;
  handleTimeout: () => void;
  
  // Timer
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (seconds?: number) => void;
  setTimeRemaining: (time: number) => void;
  
  // Edit mode
  toggleEditMode: () => void;
  
  // Round management
  addRound: (round: Round) => void;
  updateRound: (index: number, round: Round) => void;
  deleteRound: (index: number) => void;
  
  // Question management
  addQuestion: (roundIndex: number, question: Question) => void;
  updateQuestion: (roundIndex: number, questionIndex: number, question: Question) => void;
  deleteQuestion: (roundIndex: number, questionIndex: number) => void;
  
  // Getters
  currentRound: Round | null;
  currentQuestion: Question | null;
  totalQuestions: number;
  totalPoints: number;
  
  // Tracking answered questions
  answeredQuestions: Set<string>;
  lastQuestionResult: { points: number; isCorrect: boolean; negativePoints?: number } | null;
}

const STORAGE_KEY = 'quiz-rounds-data';

const defaultRounds: Round[] = [
  {
    id: '1',
    name: 'Round 1',
    theme: 'Networking Basics',
    questions: [
      {
        id: '1-1',
        questionText: 'Which protocol is specifically utilized for facilitating secure web browsing by encrypting the communication between the client\'s browser and the web server via SSL/TLS?',
        options: [
          { label: 'A', text: 'HTTP (Hypertext Transfer Protocol)' },
          { label: 'B', text: 'FTP (File Transfer Protocol)' },
          { label: 'C', text: 'HTTPS (Hypertext Transfer Protocol Secure)' },
          { label: 'D', text: 'SSH (Secure Shell Protocol)' },
        ],
        correctAnswer: 'C',
        points: 10,
        explanation: 'HTTPS is the correct standard for secure web communication.',
        questionType: 'normal',
        timeLimit: 60,
      },
      {
        id: '1-2',
        questionText: 'In the OSI model, which layer is responsible for routing data packets between different networks?',
        options: [
          { label: 'A', text: 'Data Link Layer (Layer 2)' },
          { label: 'B', text: 'Network Layer (Layer 3)' },
          { label: 'C', text: 'Transport Layer (Layer 4)' },
          { label: 'D', text: 'Session Layer (Layer 5)' },
        ],
        correctAnswer: 'B',
        points: 10,
        questionType: 'normal',
        timeLimit: 60,
      },
    ],
  },
  {
    id: '2',
    name: 'Round 2',
    theme: 'Cybersecurity',
    questions: [
      {
        id: '2-1',
        questionText: 'What type of attack involves an attacker intercepting communication between two parties without their knowledge?',
        options: [
          { label: 'A', text: 'DDoS Attack' },
          { label: 'B', text: 'Phishing Attack' },
          { label: 'C', text: 'Man-in-the-Middle Attack' },
          { label: 'D', text: 'SQL Injection' },
        ],
        correctAnswer: 'C',
        points: 20,
        questionType: 'normal',
        timeLimit: 60,
      },
    ],
  },
];

const loadRoundsFromStorage = (): Round[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load rounds from storage:', e);
  }
  return defaultRounds;
};

const saveRoundsToStorage = (rounds: Round[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rounds));
  } catch (e) {
    console.error('Failed to save rounds to storage:', e);
  }
};

const QuizContext = createContext<QuizContextType | null>(null);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

// Hook that returns a frozen snapshot of question data - prevents flash during slide transitions
export const useQuizStatic = () => {
  const { currentQuestion, currentQuestionIndex, currentRound } = useQuiz();
  
  // Store frozen values in refs that only update when question actually changes
  const frozenRef = useRef({
    question: currentQuestion,
    questionIndex: currentQuestionIndex,
    roundLength: currentRound?.questions.length || 0,
  });
  
  // Only update frozen values when the question ID changes (new question loaded)
  useEffect(() => {
    if (currentQuestion?.id !== frozenRef.current.question?.id) {
      frozenRef.current = {
        question: currentQuestion,
        questionIndex: currentQuestionIndex,
        roundLength: currentRound?.questions.length || 0,
      };
    }
  }, [currentQuestion, currentQuestionIndex, currentRound]);
  
  return frozenRef.current;
};

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [rounds, setRounds] = useState<Round[]>(() => loadRoundsFromStorage());
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState<SlideType>('home');
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isEditMode, setIsEditMode] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [lastQuestionResult, setLastQuestionResult] = useState<{ points: number; isCorrect: boolean; negativePoints?: number } | null>(null);

  // Computed values
  const currentRound = rounds[currentRoundIndex] || null;
  const currentQuestion = currentRound?.questions[currentQuestionIndex] || null;
  const totalQuestions = rounds.reduce((sum, r) => sum + r.questions.length, 0);
  const totalPoints = rounds.reduce((sum, r) => 
    sum + r.questions.reduce((qSum, q) => qSum + q.points, 0), 0
  );

  const goToSlide = useCallback((slide: SlideType) => {
    setCurrentSlide(slide);
  }, []);

  const selectRound = useCallback((index: number) => {
    setCurrentRoundIndex(index);
    setCurrentQuestionIndex(0);
    setAnswerRevealed(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setLastQuestionResult(null);
    setCurrentSlide('questions'); // Go to question selection instead of directly to question
  }, []);

  const selectQuestion = useCallback((roundIndex: number, questionIndex: number) => {
    setCurrentRoundIndex(roundIndex);
    setCurrentQuestionIndex(questionIndex);
    setAnswerRevealed(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setLastQuestionResult(null);
    const question = rounds[roundIndex]?.questions[questionIndex];
    setTimeRemaining(question?.timeLimit || 60);
    setTimerRunning(false);
    setCurrentSlide('question');
  }, [rounds]);

  const selectAnswer = useCallback((answer: string) => {
    if (answerRevealed || !currentQuestion) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setAnswerRevealed(true);
    setTimerRunning(false);
    
    // Mark question as answered
    const questionKey = `${currentRoundIndex}-${currentQuestionIndex}`;
    setAnsweredQuestions(prev => new Set(prev).add(questionKey));
    
    if (correct) {
      setScore(prev => prev + currentQuestion.points);
      setCorrectAnswers(prev => prev + 1);
      setShowCelebration(true);
      setLastQuestionResult({ points: currentQuestion.points, isCorrect: true });
    } else {
      // Apply negative marking if configured
      const negativePoints = currentQuestion.negativePoints || 0;
      if (negativePoints > 0) {
        setScore(prev => Math.max(0, prev - negativePoints));
      }
      setLastQuestionResult({ 
        points: 0, 
        isCorrect: false, 
        negativePoints: negativePoints > 0 ? negativePoints : undefined 
      });
    }
    
    // Show feedback screen after a brief delay
    setTimeout(() => {
      setCurrentSlide(correct ? 'correct' : 'wrong');
    }, 500);
  }, [answerRevealed, currentQuestion, currentRoundIndex, currentQuestionIndex]);

  const handleTimeout = useCallback(() => {
    if (answerRevealed || !currentQuestion) return;
    
    setAnswerRevealed(true);
    setTimerRunning(false);
    setIsCorrect(false);
    
    // Apply negative marking for timeout if configured
    const negativePoints = currentQuestion.negativePoints || 0;
    if (negativePoints > 0) {
      setScore(prev => Math.max(0, prev - negativePoints));
    }
    setLastQuestionResult({ 
      points: 0, 
      isCorrect: false, 
      negativePoints: negativePoints > 0 ? negativePoints : undefined 
    });
    
    setCurrentSlide('timeout');
  }, [answerRevealed, currentQuestion]);

  const continueAfterFeedback = useCallback(() => {
    setShowCelebration(false);
    setLastQuestionResult(null);
    
    // Move to next question or show round complete
    if (currentRound && currentQuestionIndex < currentRound.questions.length - 1) {
      const nextQuestion = currentRound.questions[currentQuestionIndex + 1];
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswerRevealed(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeRemaining(nextQuestion?.timeLimit || 60);
      setTimerRunning(false);
      setCurrentSlide('question');
    } else {
      // Round is complete - show round complete slide instead of auto-advancing
      setCurrentSlide('round-complete');
    }
  }, [currentRound, currentQuestionIndex]);

  const nextQuestion = useCallback(() => {
    if (!currentRound) return;
    
    if (currentQuestionIndex < currentRound.questions.length - 1) {
      const nextQ = currentRound.questions[currentQuestionIndex + 1];
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswerRevealed(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowCelebration(false);
      setTimeRemaining(nextQ?.timeLimit || 60);
      setTimerRunning(false);
    } else {
      // Show round complete slide
      setCurrentSlide('round-complete');
    }
  }, [currentRound, currentQuestionIndex]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      const prevQ = rounds[currentRoundIndex]?.questions[currentQuestionIndex - 1];
      setCurrentQuestionIndex(prev => prev - 1);
      setAnswerRevealed(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowCelebration(false);
      setTimeRemaining(prevQ?.timeLimit || 60);
      setTimerRunning(false);
    } else if (currentRoundIndex > 0) {
      const prevRound = rounds[currentRoundIndex - 1];
      const prevQ = prevRound.questions[prevRound.questions.length - 1];
      setCurrentRoundIndex(prev => prev - 1);
      setCurrentQuestionIndex(prevRound.questions.length - 1);
      setAnswerRevealed(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowCelebration(false);
      setTimeRemaining(prevQ?.timeLimit || 60);
      setTimerRunning(false);
    }
  }, [currentQuestionIndex, currentRoundIndex, rounds]);

  const goToNextRound = useCallback(() => {
    const nextRoundIndex = currentRoundIndex + 1;
    if (nextRoundIndex < rounds.length) {
      const nextRound = rounds[nextRoundIndex];
      const firstQuestion = nextRound?.questions[0];
      setCurrentRoundIndex(nextRoundIndex);
      setCurrentQuestionIndex(0);
      setAnswerRevealed(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowCelebration(false);
      setTimeRemaining(firstQuestion?.timeLimit || 60);
      setTimerRunning(false);
      setCurrentSlide('question');
    } else {
      // No more rounds, go to complete
      setCurrentSlide('complete');
    }
  }, [currentRoundIndex, rounds]);

  const startQuiz = useCallback(() => {
    setCurrentRoundIndex(0);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setAnswerRevealed(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeRemaining(60);
    setTimerRunning(false);
    setAnsweredQuestions(new Set());
    setLastQuestionResult(null);
    setCurrentSlide('rounds');
  }, []);

  const resetQuiz = useCallback(() => {
    setCurrentRoundIndex(0);
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setAnswerRevealed(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeRemaining(60);
    setTimerRunning(false);
    setAnsweredQuestions(new Set());
    setLastQuestionResult(null);
    setCurrentSlide('home');
  }, []);

  const resetQuestion = useCallback(() => {
    setAnswerRevealed(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowCelebration(false);
    setTimeRemaining(60);
    setTimerRunning(false);
    setCurrentSlide('question');
  }, []);

  const startTimer = useCallback(() => setTimerRunning(true), []);
  const pauseTimer = useCallback(() => setTimerRunning(false), []);
  const resetTimer = useCallback((seconds = 60) => {
    setTimeRemaining(seconds);
    setTimerRunning(false);
  }, []);

  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
    if (!isEditMode) {
      setCurrentSlide('editor');
    } else {
      setCurrentSlide('home');
    }
  }, [isEditMode]);

  // Round management
  const addRound = useCallback((round: Round) => {
    setRounds(prev => {
      const newRounds = [...prev, round];
      saveRoundsToStorage(newRounds);
      return newRounds;
    });
  }, []);

  const updateRound = useCallback((index: number, round: Round) => {
    setRounds(prev => {
      const newRounds = [...prev];
      newRounds[index] = round;
      saveRoundsToStorage(newRounds);
      return newRounds;
    });
  }, []);

  const deleteRound = useCallback((index: number) => {
    setRounds(prev => {
      const newRounds = prev.filter((_, i) => i !== index);
      saveRoundsToStorage(newRounds);
      return newRounds;
    });
  }, []);

  // Question management
  const addQuestion = useCallback((roundIndex: number, question: Question) => {
    setRounds(prev => {
      const newRounds = [...prev];
      newRounds[roundIndex] = {
        ...newRounds[roundIndex],
        questions: [...newRounds[roundIndex].questions, question],
      };
      saveRoundsToStorage(newRounds);
      return newRounds;
    });
  }, []);

  const updateQuestion = useCallback((roundIndex: number, questionIndex: number, question: Question) => {
    setRounds(prev => {
      const newRounds = [...prev];
      const newQuestions = [...newRounds[roundIndex].questions];
      newQuestions[questionIndex] = question;
      newRounds[roundIndex] = { ...newRounds[roundIndex], questions: newQuestions };
      saveRoundsToStorage(newRounds);
      return newRounds;
    });
  }, []);

  const deleteQuestion = useCallback((roundIndex: number, questionIndex: number) => {
    setRounds(prev => {
      const newRounds = [...prev];
      newRounds[roundIndex] = {
        ...newRounds[roundIndex],
        questions: newRounds[roundIndex].questions.filter((_, i) => i !== questionIndex),
      };
      saveRoundsToStorage(newRounds);
      return newRounds;
    });
  }, []);

  return (
    <QuizContext.Provider
      value={{
        rounds,
        currentRoundIndex,
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
        isEditMode,
        currentRound,
        currentQuestion,
        totalQuestions,
        totalPoints,
        answeredQuestions,
        lastQuestionResult,
        goToSlide,
        selectRound,
        selectQuestion,
        goToNextRound,
        selectAnswer,
        handleTimeout,
        continueAfterFeedback,
        nextQuestion,
        previousQuestion,
        resetQuestion,
        startQuiz,
        resetQuiz,
        startTimer,
        pauseTimer,
        resetTimer,
        setTimeRemaining,
        toggleEditMode,
        addRound,
        updateRound,
        deleteRound,
        addQuestion,
        updateQuestion,
        deleteQuestion,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
