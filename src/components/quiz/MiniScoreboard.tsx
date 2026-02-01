import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import { cn } from '@/lib/utils';

const MiniScoreboard: React.FC = () => {
  const { teams, selectedTeam, selectTeam } = useQuiz();

  return (
    <div className="flex flex-wrap gap-2">
      {teams.map((team) => (
        <button
          key={team.id}
          onClick={() => selectTeam(team.id)}
          className={cn(
            'flex items-center gap-3 rounded border-2 px-4 py-2 transition-all',
            selectedTeam === team.id
              ? 'border-primary bg-primary/20'
              : 'border-muted-foreground/30 bg-card/50 hover:border-primary/50'
          )}
        >
          <div 
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: team.color, boxShadow: `0 0 10px ${team.color}` }}
          />
          <span className="font-body text-sm font-medium text-foreground">{team.name}</span>
          <span className="font-display text-lg font-bold text-primary">{team.score}</span>
        </button>
      ))}
    </div>
  );
};

export default MiniScoreboard;
