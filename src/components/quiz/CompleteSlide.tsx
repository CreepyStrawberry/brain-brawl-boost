import React, { useEffect, useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from './SlideLayout';
import Confetti from './Confetti';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

const CompleteSlide: React.FC = () => {
  const { score, correctAnswers, totalQuestions, totalPoints, resetQuiz } = useQuiz();
  const [showConfetti, setShowConfetti] = useState(true);

  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const getMessage = () => {
    if (percentage >= 90) return { text: 'Outstanding!', color: 'text-success' };
    if (percentage >= 70) return { text: 'Great Job!', color: 'text-primary' };
    if (percentage >= 50) return { text: 'Good Effort!', color: 'text-accent' };
    return { text: 'Keep Learning!', color: 'text-warning' };
  };

  const message = getMessage();

  return (
    <SlideLayout>
      <Confetti show={showConfetti && percentage >= 50} />
      
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Trophy icon */}
        <Trophy className="mb-6 h-20 w-20 text-warning animate-pulse-glow" />
        
        {/* Title */}
        <h1 className="cyber-text-glow mb-2 text-center font-display text-4xl font-black uppercase text-primary md:text-6xl">
          Quiz Complete
        </h1>
        
        <h2 className={`mb-10 text-center font-display text-2xl uppercase tracking-widest ${message.color}`}>
          {message.text}
        </h2>

        {/* Score display */}
        <div className="mb-10 flex flex-col items-center rounded-lg border-2 border-primary bg-card/60 p-8">
          <span className="mb-2 font-body text-lg text-muted-foreground">Your Score</span>
          <div className="flex items-baseline gap-2">
            <span className="cyber-text-glow font-display text-7xl font-black text-primary">{score}</span>
            <span className="font-display text-2xl text-muted-foreground">/ {totalPoints}</span>
          </div>
          <span className="mt-2 font-display text-xl text-accent">{percentage}%</span>
        </div>

        {/* Stats */}
        <div className="mb-10 flex items-center gap-8">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-success" />
            <div>
              <span className="font-display text-2xl font-bold text-success">{correctAnswers}</span>
              <span className="ml-2 font-body text-muted-foreground">Correct</span>
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-destructive" />
            <div>
              <span className="font-display text-2xl font-bold text-destructive">{totalQuestions - correctAnswers}</span>
              <span className="ml-2 font-body text-muted-foreground">Incorrect</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <Button
          onClick={resetQuiz}
          className="border-2 border-primary bg-primary/10 px-10 py-6 font-display text-lg uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <RotateCcw className="mr-3 h-5 w-5" />
          Try Again
        </Button>
      </div>
    </SlideLayout>
  );
};

export default CompleteSlide;
