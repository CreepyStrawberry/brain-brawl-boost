import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from './SlideLayout';
import { Button } from '@/components/ui/button';
import { Play, BookOpen, Trophy, Settings } from 'lucide-react';

const HomeSlide: React.FC = () => {
  const { startQuiz, toggleEditMode, rounds, totalQuestions, totalPoints } = useQuiz();

  return (
    <SlideLayout>
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Top accent line */}
        <div className="mb-8 h-1 w-48 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        {/* Main title */}
        <h1 className="cyber-text-glow mb-4 text-center font-display text-5xl font-black uppercase tracking-wider text-primary md:text-7xl">
          IT Tech Quiz
        </h1>
        
        <p className="mb-12 max-w-xl text-center font-body text-lg text-muted-foreground md:text-xl">
          Test your knowledge across networking, cybersecurity, and emerging technologies.
        </p>

        {/* Quiz stats */}
        <div className="mb-12 flex items-center gap-8">
          <div className="flex flex-col items-center">
            <BookOpen className="mb-2 h-8 w-8 text-accent" />
            <span className="font-display text-3xl font-bold text-foreground">{rounds.length}</span>
            <span className="font-body text-sm text-muted-foreground">Rounds</span>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="flex flex-col items-center">
            <BookOpen className="mb-2 h-8 w-8 text-primary" />
            <span className="font-display text-3xl font-bold text-foreground">{totalQuestions}</span>
            <span className="font-body text-sm text-muted-foreground">Questions</span>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="flex flex-col items-center">
            <Trophy className="mb-2 h-8 w-8 text-warning" />
            <span className="font-display text-3xl font-bold text-foreground">{totalPoints}</span>
            <span className="font-body text-sm text-muted-foreground">Total Points</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            onClick={startQuiz}
            className="group relative overflow-hidden border-2 border-primary bg-primary/10 px-12 py-8 font-display text-xl uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Play className="h-6 w-6" />
              Start Quiz
            </span>
          </Button>
          
          <Button
            onClick={toggleEditMode}
            variant="outline"
            className="border-2 border-muted-foreground/30 px-8 py-8 font-display text-lg uppercase tracking-wider text-muted-foreground hover:border-accent hover:text-accent"
          >
            <Settings className="mr-2 h-5 w-5" />
            Edit Quiz
          </Button>
        </div>

        {/* Footer hint */}
        <p className="mt-12 text-center font-body text-sm text-muted-foreground/60">
          60 seconds per question • Instant feedback
        </p>
      </div>
    </SlideLayout>
  );
};

export default HomeSlide;
