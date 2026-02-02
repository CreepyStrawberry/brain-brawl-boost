import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

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
  let animationVariant = 'idle';
  
  if (isRevealed) {
    if (isSelected && isCorrect) {
      stateClass = 'correct';
      animationVariant = 'correct';
    } else if (isSelected && !isCorrect) {
      stateClass = 'incorrect';
      animationVariant = 'incorrect';
    } else if (isTheCorrectAnswer) {
      stateClass = 'correct';
    }
  }

  const buttonVariants = {
    idle: { scale: 1, x: 0 },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98 },
    correct: { 
      scale: [1, 1.05, 1],
      transition: { duration: 0.4 }
    },
    incorrect: { 
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'option-button group flex w-full items-center gap-4 text-left transition-colors',
        stateClass,
        disabled && !isRevealed && 'cursor-not-allowed opacity-50'
      )}
      variants={buttonVariants}
      initial="idle"
      animate={animationVariant}
      whileHover={!disabled ? 'hover' : undefined}
      whileTap={!disabled ? 'tap' : undefined}
    >
      {/* Option label */}
      <motion.div 
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center border-2 font-display text-xl font-bold transition-colors',
          isRevealed && isSelected && isCorrect && 'border-success bg-success/30 text-success',
          isRevealed && isSelected && !isCorrect && 'border-destructive bg-destructive/30 text-destructive',
          isRevealed && !isSelected && isTheCorrectAnswer && 'border-success bg-success/30 text-success',
          !isRevealed && 'border-primary/50 bg-primary/10 text-primary group-hover:border-primary group-hover:bg-primary/20'
        )}
        whileHover={!disabled ? { rotate: [0, -5, 5, 0] } : undefined}
        transition={{ duration: 0.3 }}
      >
        [{label}]
      </motion.div>
      
      {/* Option text */}
      <span className="flex-1 font-body text-lg">{text}</span>
      
      {/* Result icon */}
      {isRevealed && isSelected && (
        <motion.div 
          className="shrink-0"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          {isCorrect ? (
            <Check className="h-8 w-8 text-success" />
          ) : (
            <X className="h-8 w-8 text-destructive" />
          )}
        </motion.div>
      )}
      
      {isRevealed && !isSelected && isTheCorrectAnswer && (
        <motion.div 
          className="shrink-0"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        >
          <Check className="h-8 w-8 text-success" />
        </motion.div>
      )}
    </motion.button>
  );
};

export default OptionButton;
