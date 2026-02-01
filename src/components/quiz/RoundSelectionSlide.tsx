import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from './SlideLayout';
import { Button } from '@/components/ui/button';
import { Home, Play, BookOpen } from 'lucide-react';

const RoundSelectionSlide: React.FC = () => {
  const { rounds, selectRound, resetQuiz } = useQuiz();

  return (
    <SlideLayout>
      <div className="flex flex-1 flex-col px-6 py-8 lg:px-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="cyber-text-glow font-display text-3xl font-bold uppercase text-primary lg:text-4xl">
              Select Round
            </h1>
            <p className="mt-1 font-body text-muted-foreground">
              Choose a round to begin
            </p>
          </div>
          <Button
            variant="outline"
            onClick={resetQuiz}
            className="border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>

        {/* Rounds grid */}
        <div className="grid flex-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rounds.map((round, index) => (
            <button
              key={round.id}
              onClick={() => selectRound(index)}
              className="group cyber-border flex flex-col bg-card/60 p-6 text-left transition-all hover:bg-card/80 hover:border-primary"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-sm uppercase tracking-wider text-muted-foreground">
                  Round {index + 1}
                </span>
                <Play className="h-5 w-5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              
              <h3 className="mb-2 font-display text-xl font-bold text-foreground">
                {round.name}
              </h3>
              
              <p className="mb-4 font-body text-accent">
                {round.theme}
              </p>
              
              <div className="mt-auto flex items-center gap-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="font-body text-sm text-muted-foreground">
                    {round.questions.length} questions
                  </span>
                </div>
                <span className="font-body text-sm text-muted-foreground">
                  {round.questions.reduce((sum, q) => sum + q.points, 0)} pts
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Play all button */}
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => selectRound(0)}
            className="border-2 border-primary bg-primary/10 px-10 py-6 font-display text-lg uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Play className="mr-3 h-5 w-5" />
            Play All Rounds
          </Button>
        </div>
      </div>
    </SlideLayout>
  );
};

export default RoundSelectionSlide;
