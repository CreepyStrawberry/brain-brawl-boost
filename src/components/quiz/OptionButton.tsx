import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

interface OptionButtonProps {
  label: string;
  text: string;
  isSelected: boolean;
  isCorrect: boolean | null;
  isRevealed: boolean;
  correctAnswer: string;
  onClick: () => void;
  disabled: boolean;
}

const OptionButton: React.FC<OptionButtonProps> = ({
  label,
  text,
  isSelected,
  isCorrect,
  isRevealed,
  correctAnswer,
  onClick,
  disabled,
}) => {
  const isTheCorrectAnswer = label === correctAnswer;
  
  let stateClass = '';
  if (isRevealed) {
    if (isSelected && isCorrect) {
      stateClass = 'correct';
    } else if (isSelected && !isCorrect) {
      stateClass = 'incorrect animate-shake';
    } else if (isTheCorrectAnswer) {
      stateClass = 'correct';
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'option-button group flex w-full items-center gap-4 text-left transition-all',
        stateClass,
        disabled && !isRevealed && 'cursor-not-allowed opacity-50'
      )}
    >
      {/* Option label */}
      <div className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center border-2 font-display text-xl font-bold transition-all',
        isRevealed && isSelected && isCorrect && 'border-success bg-success/30 text-success',
        isRevealed && isSelected && !isCorrect && 'border-destructive bg-destructive/30 text-destructive',
        isRevealed && !isSelected && isTheCorrectAnswer && 'border-success bg-success/30 text-success',
        !isRevealed && 'border-primary/50 bg-primary/10 text-primary group-hover:border-primary group-hover:bg-primary/20'
      )}>
        [{label}]
      </div>
      
      {/* Option text */}
      <span className="flex-1 font-body text-lg">{text}</span>
      
      {/* Result icon */}
      {isRevealed && isSelected && (
        <div className="shrink-0">
          {isCorrect ? (
            <Check className="h-8 w-8 text-success" />
          ) : (
            <X className="h-8 w-8 text-destructive" />
          )}
        </div>
      )}
      
      {isRevealed && !isSelected && isTheCorrectAnswer && (
        <div className="shrink-0">
          <Check className="h-8 w-8 text-success" />
        </div>
      )}
    </button>
  );
};

export default OptionButton;
