import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import { useAudio } from '@/context/AudioContext';
import SlideLayout from './SlideLayout';
import { Button } from '@/components/ui/button';
import { Home, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const RoundSelectionSlide: React.FC = () => {
  const { rounds, selectRound, resetQuiz } = useQuiz();
  const { playClick, playSelect } = useAudio();

  const handleSelectRound = (index: number) => {
    playSelect();
    selectRound(index);
  };

  const handleHome = () => {
    playClick();
    resetQuiz();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
        staggerChildren: 0.08 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94] as const 
      }
    },
  };

  return (
    <SlideLayout>
      <motion.div 
        className="flex flex-1 flex-col items-center justify-center px-4 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="mb-6 text-center" variants={itemVariants}>
          <h1 className="cyber-text-glow font-display text-2xl font-bold uppercase text-primary">
            Select Round
          </h1>
        </motion.div>

        {/* Compact rounds list */}
        <div className="w-full max-w-md space-y-2">
          {rounds.map((round, index) => (
            <motion.button
              key={round.id}
              onClick={() => handleSelectRound(index)}
              className="group cyber-border flex w-full items-center justify-between bg-card/60 px-4 py-3 text-left transition-all hover:bg-card/80 hover:border-primary"
              variants={itemVariants}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
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
            </motion.button>
          ))}
        </div>

        {/* Action buttons */}
        <motion.div className="mt-6 flex gap-3" variants={itemVariants}>
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleHome}
              className="border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <Button
              onClick={() => handleSelectRound(0)}
              size="sm"
              className="border border-primary bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Play className="mr-2 h-4 w-4" />
              Play All
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </SlideLayout>
  );
};

export default RoundSelectionSlide;
