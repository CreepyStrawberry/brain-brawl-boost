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

export interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
}

interface QuizState {
  questions: Question[];
  teams: Team[];
  currentQuestionIndex: number;
  currentSlide: 'cover' | 'round-intro' | 'question' | 'scoreboard' | 'complete';
  selectedTeam: string | null;
  answerRevealed: boolean;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  showCelebration: boolean;
  timerRunning: boolean;
  timeRemaining: number;
}

interface QuizContextType extends QuizState {
  setQuestions: (questions: Question[]) => void;
  setTeams: (teams: Team[]) => void;
  selectTeam: (teamId: string) => void;
  selectAnswer: (answer: string) => void;
  revealAnswer: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToSlide: (slide: QuizState['currentSlide']) => void;
  resetQuestion: () => void;
  updateTeamScore: (teamId: string, points: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (seconds?: number) => void;
  setTimeRemaining: (time: number) => void;
  addPoints: () => void;
  updateQuestion: (index: number, question: Question) => void;
  updateTeamName: (teamId: string, name: string) => void;
}

const defaultQuestions: Question[] = [
  {
    id: '1',
    roundName: 'Round 1: Networking Basics',
    questionText: 'Which protocol is specifically utilized for facilitating secure web browsing by encrypting the communication between the client\'s browser and the web server via SSL/TLS? This protocol operates primarily on port 443.',
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
    roundName: 'Round 1: Networking Basics',
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
    roundName: 'Round 2: Cybersecurity',
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

const defaultTeams: Team[] = [
  { id: '1', name: 'Team Alpha', score: 0, color: 'hsl(180, 100%, 50%)' },
  { id: '2', name: 'Team Beta', score: 0, color: 'hsl(150, 85%, 45%)' },
  { id: '3', name: 'Team Gamma', score: 0, color: 'hsl(45, 100%, 55%)' },
  { id: '4', name: 'Team Delta', score: 0, color: 'hsl(280, 80%, 60%)' },
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
  const [teams, setTeams] = useState<Team[]>(defaultTeams);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState<QuizState['currentSlide']>('cover');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);

  const selectTeam = useCallback((teamId: string) => {
    setSelectedTeam(teamId);
  }, []);

  const selectAnswer = useCallback((answer: string) => {
    if (answerRevealed) return;
    setSelectedAnswer(answer);
    const currentQuestion = questions[currentQuestionIndex];
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setAnswerRevealed(true);
    setTimerRunning(false);
    
    if (correct) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [answerRevealed, questions, currentQuestionIndex]);

  const addPoints = useCallback(() => {
    if (selectedTeam && isCorrect) {
      const currentQuestion = questions[currentQuestionIndex];
      setTeams(prev => prev.map(team => 
        team.id === selectedTeam 
          ? { ...team, score: team.score + currentQuestion.points }
          : team
      ));
    }
  }, [selectedTeam, isCorrect, questions, currentQuestionIndex]);

  const revealAnswer = useCallback(() => {
    setAnswerRevealed(true);
    setTimerRunning(false);
  }, []);

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
    if (slide === 'question') {
      setAnswerRevealed(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeRemaining(60);
      setTimerRunning(false);
    }
  }, []);

  const resetQuestion = useCallback(() => {
    setAnswerRevealed(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowCelebration(false);
    setTimeRemaining(60);
    setTimerRunning(false);
  }, []);

  const updateTeamScore = useCallback((teamId: string, points: number) => {
    setTeams(prev => prev.map(team =>
      team.id === teamId ? { ...team, score: team.score + points } : team
    ));
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

  const updateTeamName = useCallback((teamId: string, name: string) => {
    setTeams(prev => prev.map(team =>
      team.id === teamId ? { ...team, name } : team
    ));
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        teams,
        currentQuestionIndex,
        currentSlide,
        selectedTeam,
        answerRevealed,
        selectedAnswer,
        isCorrect,
        showCelebration,
        timerRunning,
        timeRemaining,
        setQuestions,
        setTeams,
        selectTeam,
        selectAnswer,
        revealAnswer,
        nextQuestion,
        previousQuestion,
        goToSlide,
        resetQuestion,
        updateTeamScore,
        startTimer,
        pauseTimer,
        resetTimer,
        setTimeRemaining,
        addPoints,
        updateQuestion,
        updateTeamName,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
