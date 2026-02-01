import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from './SlideLayout';
import { Button } from '@/components/ui/button';
import { Home, Play, BookOpen } from 'lucide-react';

const RoundSelectionSlide: React.FC = () => {
  const { rounds, selectRound, resetQuiz } = useQuiz();

  return (
    <SlideLayout>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="cyber-text-glow font-display text-2xl font-bold uppercase text-primary">
            Select Round
          </h1>
        </div>

        {/* Compact rounds list */}
        <div className="w-full max-w-md space-y-2">
          {rounds.map((round, index) => (
            <button
              key={round.id}
              onClick={() => selectRound(index)}
              className="group cyber-border flex w-full items-center justify-between bg-card/60 px-4 py-3 text-left transition-all hover:bg-card/80 hover:border-primary"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center border border-primary/50 bg-primary/10 font-display text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold text-foreground">
                    {round.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {round.theme} • {round.questions.length} Q
                  </p>
                </div>
              </div>
              <Play className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={resetQuiz}
            className="border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
          <Button
            onClick={() => selectRound(0)}
            size="sm"
            className="border border-primary bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Play className="mr-2 h-4 w-4" />
            Play All
          </Button>
        </div>
      </div>
    </SlideLayout>
  );
};

export default RoundSelectionSlide;
