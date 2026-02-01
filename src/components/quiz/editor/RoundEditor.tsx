import React, { useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from '../SlideLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import { Round } from '@/types/quiz';

interface RoundEditorProps {
  round: Round;
  isNew: boolean;
  roundIndex: number;
  onSave: () => void;
  onCancel: () => void;
}

const RoundEditor: React.FC<RoundEditorProps> = ({
  round,
  isNew,
  roundIndex,
  onSave,
  onCancel,
}) => {
  const { addRound, updateRound } = useQuiz();
  const [name, setName] = useState(round.name);
  const [theme, setTheme] = useState(round.theme);

  const handleSave = () => {
    const updatedRound: Round = {
      ...round,
      name,
      theme,
    };

    if (isNew) {
      addRound(updatedRound);
    } else {
      updateRound(roundIndex, updatedRound);
    }
    onSave();
  };

  const themeOptions = [
    'Programming',
    'Networking',
    'Artificial Intelligence',
    'Cyber Security',
    'Logic & Reasoning',
    'Rapid Fire',
    'Visual & Diagrams',
    'Debugging',
    'Web Development',
    'Database',
    'Cloud Computing',
    'Operating Systems',
  ];

  return (
    <SlideLayout>
      <div className="flex flex-1 flex-col px-6 py-8 lg:px-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold uppercase text-primary">
                {isNew ? 'Create Round' : 'Edit Round'}
              </h1>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || !theme.trim()}
            className="border-2 border-success bg-success/10 text-success hover:bg-success hover:text-success-foreground"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Round
          </Button>
        </div>

        {/* Form */}
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <div className="cyber-border bg-card/60 p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="font-display text-sm uppercase tracking-wider text-foreground">
                  Round Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Round 1, Bonus Round"
                  className="mt-2 border-2 border-primary/30 bg-background/50 font-body text-foreground focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="theme" className="font-display text-sm uppercase tracking-wider text-foreground">
                  Round Theme
                </Label>
                <Input
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g., Networking, Cyber Security"
                  className="mt-2 border-2 border-primary/30 bg-background/50 font-body text-foreground focus:border-primary"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {themeOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setTheme(option)}
                      className={`rounded-full border px-3 py-1 font-body text-xs transition-all ${
                        theme === option
                          ? 'border-accent bg-accent/20 text-accent'
                          : 'border-muted bg-muted/10 text-muted-foreground hover:border-primary hover:text-primary'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="cyber-border bg-card/40 p-6">
            <h3 className="mb-4 font-display text-sm uppercase tracking-wider text-muted-foreground">
              Preview
            </h3>
            <div className="cyber-border bg-card/60 p-4">
              <p className="font-display text-sm uppercase tracking-wider text-muted-foreground">
                Round {roundIndex + 1}
              </p>
              <h3 className="mt-1 font-display text-xl font-bold text-foreground">
                {name || 'Round Name'}
              </h3>
              <p className="mt-1 font-body text-accent">
                {theme || 'Theme'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
};

export default RoundEditor;
