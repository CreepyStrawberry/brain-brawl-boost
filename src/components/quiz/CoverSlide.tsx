import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from './SlideLayout';
import { Button } from '@/components/ui/button';
import { ChevronRight, Settings } from 'lucide-react';

const CoverSlide: React.FC = () => {
  const { goToSlide } = useQuiz();

  return (
    <SlideLayout>
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
        {/* Top accent line */}
        <div className="mb-8 h-1 w-64 bg-gradient-to-r from-transparent via-primary to-transparent" />
        
        {/* Main title */}
        <h1 className="cyber-text-glow mb-4 text-center font-display text-6xl font-black uppercase tracking-wider text-primary md:text-8xl">
          IT Tech Quiz 2026
        </h1>
        
        <h2 className="mb-12 text-center font-display text-2xl font-medium tracking-widest text-foreground/80 md:text-3xl">
          Inter-College Competition
        </h2>

        {/* Decorative element */}
        <div className="mb-12 flex items-center gap-4">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-primary/50" />
          <div className="h-3 w-3 rotate-45 border-2 border-primary bg-primary/20" />
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-primary/50" />
        </div>

        {/* Description */}
        <p className="mb-16 max-w-3xl text-center font-body text-lg leading-relaxed text-muted-foreground md:text-xl">
          Welcome to the ultimate frontier of digital intelligence where the brightest minds from 
          across the academic spectrum converge. Prepare to navigate through complex layers of 
          network protocols, cybersecurity maneuvers, and emerging AI paradigms.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => goToSlide('round-intro')}
            className="group relative overflow-hidden border-2 border-primary bg-primary/10 px-8 py-6 font-display text-lg uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            <span className="relative z-10 flex items-center gap-2">
              Begin Competition
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => goToSlide('scoreboard')}
            className="border-2 border-muted-foreground/30 px-8 py-6 font-display text-lg uppercase tracking-wider text-muted-foreground transition-all hover:border-accent hover:text-accent"
          >
            <Settings className="mr-2 h-5 w-5" />
            Setup Teams
          </Button>
        </div>

        {/* Bottom accent */}
        <div className="mt-auto pt-12">
          <p className="text-center font-body text-sm uppercase tracking-widest text-muted-foreground/50">
            Press SPACE or click to continue
          </p>
        </div>
      </div>
    </SlideLayout>
  );
};

export default CoverSlide;
