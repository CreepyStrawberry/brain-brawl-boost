import React, { useEffect, useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from './SlideLayout';
import Confetti from './Confetti';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw } from 'lucide-react';

const CompleteSlide: React.FC = () => {
  const { teams, goToSlide } = useQuiz();
  const [showConfetti, setShowConfetti] = useState(true);

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <SlideLayout>
      <Confetti show={showConfetti} />
      
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-12">
        {/* Title */}
        <h1 className="cyber-text-glow mb-4 text-center font-display text-5xl font-black uppercase text-primary md:text-7xl">
          Quiz Complete
        </h1>
        
        <h2 className="mb-12 text-center font-display text-2xl uppercase tracking-widest text-foreground/80">
          System Shutdown & Winner Declaration
        </h2>

        {/* Winner announcement */}
        <div className="mb-12 flex flex-col items-center">
          <div className="mb-6 flex items-center gap-4">
            <Trophy className="h-16 w-16 text-warning animate-pulse-glow" />
          </div>
          
          <p className="mb-2 font-display text-xl uppercase tracking-widest text-muted-foreground">
            Champion
          </p>
          
          <h3 
            className="mb-4 font-display text-5xl font-black md:text-6xl"
            style={{ color: winner.color, textShadow: `0 0 30px ${winner.color}` }}
          >
            {winner.name}
          </h3>
          
          <div className="flex items-baseline gap-2">
            <span className="font-display text-6xl font-black text-primary">{winner.score}</span>
            <span className="font-display text-2xl text-muted-foreground">points</span>
          </div>
        </div>

        {/* Final standings */}
        <div className="mb-12 w-full max-w-2xl">
          <h4 className="mb-4 text-center font-display text-lg uppercase tracking-wider text-muted-foreground">
            Final Standings
          </h4>
          
          <div className="space-y-3">
            {sortedTeams.map((team, index) => (
              <div
                key={team.id}
                className="flex items-center gap-4 rounded border border-border bg-card/50 p-4"
              >
                <span className="font-display text-2xl font-bold text-muted-foreground">
                  #{index + 1}
                </span>
                <div 
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: team.color, boxShadow: `0 0 10px ${team.color}` }}
                />
                <span className="flex-1 font-display text-xl text-foreground">{team.name}</span>
                <span className="font-display text-2xl font-bold text-primary">{team.score} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Closing message */}
        <p className="mb-8 max-w-2xl text-center font-body text-lg text-muted-foreground">
          The final packet has been transmitted and the data stream is now closing. 
          We have witnessed an extraordinary display of technical acumen and rapid-fire problem solving. 
          The champions will now be heralded as the architects of tomorrow.
        </p>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={handleRestart}
            className="border-2 border-primary bg-primary/10 px-8 py-6 font-display text-lg uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            New Quiz
          </Button>
          
          <Button
            variant="outline"
            onClick={() => goToSlide('scoreboard')}
            className="border-2 border-muted-foreground/30 px-8 py-6 font-display text-lg uppercase tracking-wider text-muted-foreground hover:border-accent hover:text-accent"
          >
            View Scoreboard
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-12">
          <p className="text-center font-body text-sm text-muted-foreground/50">
            © 2026 IT Tech Quiz. All Rights Reserved. Powered by Tomorrow's Architects.
          </p>
        </div>
      </div>
    </SlideLayout>
  );
};

export default CompleteSlide;
