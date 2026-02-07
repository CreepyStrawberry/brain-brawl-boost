import React, { useEffect } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { useAudio } from '@/context/AudioContext';
import SlideLayout from './SlideLayout';
import Confetti from './Confetti';
import { Button } from '@/components/ui/button';
import { Trophy, LayoutGrid, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const RoundCompleteSlide: React.FC = () => {
  const { 
    rounds,
    currentRoundIndex,
    currentRound,
    score,
    goToSlide,
    goToNextRound,
    resetQuiz,
  } = useQuiz();

  const { playClick, playRoundComplete } = useAudio();

  // Play round complete sound on mount
  useEffect(() => {
    playRoundComplete();
  }, [playRoundComplete]);

  const isLastRound = currentRoundIndex === rounds.length - 1;

  const handleExit = () => {
    playClick();
    resetQuiz();
  };

  const handleBackToRounds = () => {
    playClick();
    goToSlide('rounds');
  };

  const handleContinue = () => {
    playClick();
    goToNextRound();
  };

  const handleFinishQuiz = () => {
    playClick();
    goToSlide('complete');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
        staggerChildren: 0.12 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94] as const 
      }
    },
  };

  return (
    <SlideLayout showAudioControls={false}>
      <Confetti show={true} />
      
      <motion.div 
        className="flex flex-1 flex-col items-center justify-center px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Trophy icon */}
        <motion.div 
          className="mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 150, 
            damping: 12,
            duration: 0.8 
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ 
              duration: 0.6, 
              repeat: 3, 
              ease: [0.4, 0, 0.2, 1] as const 
            }}
          >
            <Trophy className="h-24 w-24 text-accent" />
          </motion.div>
        </motion.div>
        
        {/* Round complete message */}
        <motion.h1 
          className="mb-2 text-center font-display text-4xl font-black uppercase text-primary md:text-5xl"
          variants={itemVariants}
          style={{ textShadow: '0 0 20px hsl(var(--primary) / 0.5)' }}
        >
          Round Complete!
        </motion.h1>
        
        <motion.p 
          className="mb-8 text-center font-display text-xl text-foreground"
          variants={itemVariants}
        >
          {currentRound?.name} - {currentRound?.theme}
        </motion.p>

        {/* Stats */}
        <motion.div 
          className="mb-10 grid grid-cols-2 gap-6"
          variants={itemVariants}
        >
          <div className="rounded-lg border-2 border-primary bg-primary/10 px-8 py-4 text-center">
            <p className="font-body text-sm text-muted-foreground">Questions</p>
            <p className="font-display text-3xl font-bold text-primary">
              {currentRound?.questions.length || 0}
            </p>
          </div>
          <div className="rounded-lg border-2 border-success bg-success/10 px-8 py-4 text-center">
            <p className="font-body text-sm text-muted-foreground">Total Score</p>
            <p className="font-display text-3xl font-bold text-success">{score}</p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-4"
          variants={itemVariants}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <Button
              onClick={handleExit}
              variant="outline"
              className="border-2 border-muted-foreground/30 px-6 py-6 font-display uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary"
            >
              <Home className="mr-2 h-5 w-5" />
              Exit
            </Button>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <Button
              onClick={handleBackToRounds}
              className="border-2 border-accent bg-accent/10 px-8 py-6 font-display text-lg uppercase tracking-wider text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <LayoutGrid className="mr-2 h-5 w-5" />
              Back to Rounds
            </Button>
          </motion.div>

          {isLastRound ? (
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
            >
              <Button
                onClick={handleFinishQuiz}
                className="border-2 border-success bg-success/10 px-8 py-6 font-display text-lg uppercase tracking-wider text-success hover:bg-success hover:text-success-foreground"
              >
                Finish Quiz
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
            >
              <Button
                onClick={handleContinue}
                className="border-2 border-primary bg-primary/10 px-8 py-6 font-display text-lg uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </SlideLayout>
  );
};

export default RoundCompleteSlide;
