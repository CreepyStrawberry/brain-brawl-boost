import React, { useEffect } from 'react';
import { useQuiz, useQuizStatic } from '@/context/QuizContext';
import { useAudio } from '@/context/AudioContext';
import SlideLayout from './SlideLayout';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, RotateCcw, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const TimeoutSlide: React.FC = () => {
  const { question: frozenQuestion } = useQuizStatic();
  const { 
    continueAfterFeedback, 
    resetQuestion,
    goToSlide,
    currentRound,
    currentQuestionIndex
  } = useQuiz();
  
  const { playClick, playIncorrect } = useAudio();

  // Play timeout sound on mount
  useEffect(() => {
    playIncorrect();
  }, [playIncorrect]);

  // Auto-advance after showing timeout message
  useEffect(() => {
    const timer = setTimeout(() => {
      continueAfterFeedback();
    }, 3500);
    return () => clearTimeout(timer);
  }, [continueAfterFeedback]);

  const handleContinue = () => {
    playClick();
    continueAfterFeedback();
  };

  const handleTryAgain = () => {
    playClick();
    resetQuestion();
  };

  const handleGoToQuestions = () => {
    playClick();
    goToSlide('questions');
  };

  if (!frozenQuestion) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94] as const 
      }
    },
  };

  return (
    <SlideLayout showAudioControls={false}>
      <motion.div 
        className="flex flex-1 flex-col items-center justify-center px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Timeout icon */}
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
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 0.8, 
              repeat: 2,
              ease: [0.4, 0, 0.2, 1] as const 
            }}
          >
            <Clock className="h-32 w-32 text-warning" />
          </motion.div>
        </motion.div>
        
        {/* Timeout message */}
        <motion.h1 
          className="mb-4 text-center font-display text-5xl font-black uppercase text-warning md:text-7xl"
          variants={itemVariants}
          style={{
            textShadow: '0 0 20px hsl(45 100% 50% / 0.5)',
          }}
        >
          Time's Up!
        </motion.h1>
        
        <motion.p 
          className="mb-8 text-center font-body text-xl text-muted-foreground"
          variants={itemVariants}
        >
          You ran out of time for this question
        </motion.p>

        {/* Show correct answer */}
        <motion.div 
          className="mb-6 rounded-lg border-2 border-success bg-success/10 px-8 py-6"
          variants={itemVariants}
        >
          <p className="mb-2 text-sm text-muted-foreground">The correct answer was:</p>
          <span className="font-display text-2xl font-bold text-success">
            [{frozenQuestion.correctAnswer}] {frozenQuestion.options.find(o => o.label === frozenQuestion.correctAnswer)?.text}
          </span>
        </motion.div>

        {/* Explanation if available */}
        {frozenQuestion.explanation && (
          <motion.div 
            className="mb-8 max-w-2xl border-l-4 border-warning bg-card/60 p-4"
            variants={itemVariants}
          >
            <p className="font-body text-foreground">{frozenQuestion.explanation}</p>
          </motion.div>
        )}

        {/* Auto-advance hint */}
        <motion.p 
          className="mb-6 text-center font-body text-sm text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Moving to next question...
        </motion.p>

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
              onClick={handleTryAgain}
              variant="outline"
              className="border-2 border-muted-foreground/30 px-6 py-6 font-display uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Try Again
            </Button>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <Button
              onClick={handleGoToQuestions}
              variant="outline"
              className="border-2 border-accent/50 px-6 py-6 font-display uppercase tracking-wider text-accent hover:border-accent hover:bg-accent/10"
            >
              <LayoutGrid className="mr-2 h-5 w-5" />
              Questions
            </Button>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <Button
              onClick={handleContinue}
              className="border-2 border-warning bg-warning/10 px-8 py-6 font-display text-lg uppercase tracking-wider text-warning hover:bg-warning hover:text-warning-foreground"
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </SlideLayout>
  );
};

export default TimeoutSlide;
