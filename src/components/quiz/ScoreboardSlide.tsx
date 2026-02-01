import React, { useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from './SlideLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Edit2, Check, Trophy } from 'lucide-react';

const ScoreboardSlide: React.FC = () => {
  const { teams, goToSlide, updateTeamName, updateTeamScore } = useQuiz();
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...teams.map(t => t.score), 100);

  const startEditing = (teamId: string, currentName: string) => {
    setEditingTeam(teamId);
    setEditName(currentName);
  };

  const saveEdit = (teamId: string) => {
    if (editName.trim()) {
      updateTeamName(teamId, editName.trim());
    }
    setEditingTeam(null);
  };

  return (
    <SlideLayout>
      <div className="flex flex-1 flex-col px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="cyber-text-glow mb-2 font-display text-4xl font-bold text-primary md:text-5xl">
            Live Scoreboard
          </h1>
          <p className="font-body text-xl text-muted-foreground">
            Session Standings: Real-Time Telemetry
          </p>
          <div className="mt-4 h-1 w-full bg-gradient-to-r from-primary via-accent to-secondary" />
        </div>

        {/* Team cards */}
        <div className="grid flex-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedTeams.map((team, index) => (
            <div
              key={team.id}
              className="cyber-border flex flex-col bg-card/60 p-6"
            >
              {/* Rank badge */}
              {index === 0 && (
                <div className="mb-4 flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-warning" />
                  <span className="font-display text-sm uppercase tracking-wider text-warning">Leading</span>
                </div>
              )}

              {/* Score */}
              <div className="mb-4 flex items-baseline gap-2">
                <span 
                  className="font-display text-6xl font-black"
                  style={{ color: team.color, textShadow: `0 0 20px ${team.color}50` }}
                >
                  {team.score}
                </span>
                <span className="font-display text-2xl text-muted-foreground">pts</span>
              </div>

              {/* Team name */}
              <div className="mb-4 flex items-center gap-2">
                {editingTeam === team.id ? (
                  <>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border-primary bg-background/50 font-display text-lg"
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(team.id)}
                      autoFocus
                    />
                    <Button
                      size="sm"
                      onClick={() => saveEdit(team.id)}
                      className="border-success bg-success/20 text-success hover:bg-success hover:text-success-foreground"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="font-display text-2xl font-bold text-foreground">{team.name}</h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditing(team.id, team.name)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {/* Progress bar */}
              <div className="mb-4 h-3 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(team.score / maxScore) * 100}%`,
                    backgroundColor: team.color,
                    boxShadow: `0 0 10px ${team.color}`
                  }}
                />
              </div>

              {/* Quick score adjustments */}
              <div className="mt-auto flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateTeamScore(team.id, -10)}
                  className="flex-1 border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  -10
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateTeamScore(team.id, 10)}
                  className="flex-1 border-success/50 text-success hover:bg-success hover:text-success-foreground"
                >
                  +10
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateTeamScore(team.id, 20)}
                  className="flex-1 border-success/50 text-success hover:bg-success hover:text-success-foreground"
                >
                  +20
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => goToSlide('question')}
            className="border-2 border-muted-foreground/30 px-6 py-4 font-display uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Back to Quiz
          </Button>
        </div>
      </div>
    </SlideLayout>
  );
};

export default ScoreboardSlide;
