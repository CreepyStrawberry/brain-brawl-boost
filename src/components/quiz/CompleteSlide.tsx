import React, { useEffect, useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from './SlideLayout';
import Confetti from './Confetti';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, CheckCircle, XCircle, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const CompleteSlide: React.FC = () => {
  const { score, correctAnswers, totalQuestions, totalPoints, resetQuiz, goToSlide } = useQuiz();
  const [showConfetti, setShowConfetti] = useState(true);

  const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const getMessage = () => {
    if (percentage >= 90) return { text: 'Outstanding!', color: 'text-success' };
    if (percentage >= 70) return { text: 'Great Job!', color: 'text-primary' };
    if (percentage >= 50) return { text: 'Good Effort!', color: 'text-accent' };
    return { text: 'Keep Learning!', color: 'text-warning' };
  };

  const message = getMessage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
    <SlideLayout>
      <Confetti show={showConfetti && percentage >= 50} />
      
      <motion.div 
        className="flex flex-1 flex-col items-center justify-center px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Trophy icon */}
        <motion.div variants={itemVariants}>
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
          >
            <Trophy className="mb-6 h-20 w-20 text-warning" />
          </motion.div>
        </motion.div>
        
        {/* Title */}
        <motion.h1 
          className="cyber-text-glow mb-2 text-center font-display text-4xl font-black uppercase text-primary md:text-6xl"
          variants={itemVariants}
        >
          Quiz Complete
        </motion.h1>
        
        <motion.h2 
          className={`mb-10 text-center font-display text-2xl uppercase tracking-widest ${message.color}`}
          variants={itemVariants}
        >
          {message.text}
        </motion.h2>

        {/* Score display */}
        <motion.div 
          className="mb-10 flex flex-col items-center rounded-lg border-2 border-primary bg-card/60 p-8"
          variants={itemVariants}
        >
          <span className="mb-2 font-body text-lg text-muted-foreground">Your Score</span>
          <div className="flex items-baseline gap-2">
            <motion.span 
              className="cyber-text-glow font-display text-7xl font-black text-primary"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.5 }}
            >
              {score}
            </motion.span>
            <span className="font-display text-2xl text-muted-foreground">/ {totalPoints}</span>
          </div>
          <motion.span 
            className="mt-2 font-display text-xl text-accent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {percentage}%
          </motion.span>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="mb-10 flex items-center gap-8"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-success" />
            <div>
              <span className="font-display text-2xl font-bold text-success">{correctAnswers}</span>
              <span className="ml-2 font-body text-muted-foreground">Correct</span>
            </div>
          </div>
          <div className="h-10 w-px bg-border" />
          <div className="flex items-center gap-3">
            <XCircle className="h-8 w-8 text-destructive" />
            <div>
              <span className="font-display text-2xl font-bold text-destructive">{totalQuestions - correctAnswers}</span>
              <span className="ml-2 font-body text-muted-foreground">Incorrect</span>
            </div>
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
              onClick={() => goToSlide('rounds')}
              variant="outline"
              className="border-2 border-muted-foreground/30 px-8 py-6 font-display text-lg uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary"
            >
              <LayoutGrid className="mr-3 h-5 w-5" />
              Round Selection
            </Button>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <Button
              onClick={resetQuiz}
              className="border-2 border-primary bg-primary/10 px-10 py-6 font-display text-lg uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <RotateCcw className="mr-3 h-5 w-5" />
              Try Again
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </SlideLayout>
  );
};

export default CompleteSlide;
