import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from './SlideLayout';
import { Button } from '@/components/ui/button';
import { Play, BookOpen, Trophy, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const HomeSlide: React.FC = () => {
  const { startQuiz, toggleEditMode, rounds, totalQuestions, totalPoints } = useQuiz();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
        staggerChildren: 0.12 
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
    <SlideLayout>
      <motion.div 
        className="flex flex-1 flex-col items-center justify-center px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top accent line */}
        <motion.div 
          className="mb-8 h-1 w-48 bg-gradient-to-r from-transparent via-primary to-transparent"
          variants={itemVariants}
        />
        
        {/* Main title */}
        <motion.h1 
          className="cyber-text-glow mb-4 text-center font-display text-5xl font-black uppercase tracking-wider text-primary md:text-7xl"
          variants={itemVariants}
        >
          IT Tech Quiz
        </motion.h1>
        
        <motion.p 
          className="mb-12 max-w-xl text-center font-body text-lg text-muted-foreground md:text-xl"
          variants={itemVariants}
        >
          Test your knowledge across networking, cybersecurity, and emerging technologies.
        </motion.p>

        {/* Quiz stats */}
        <motion.div 
          className="mb-12 flex items-center gap-8"
          variants={itemVariants}
        >
          <div className="flex flex-col items-center">
            <BookOpen className="mb-2 h-8 w-8 text-accent" />
            <span className="font-display text-3xl font-bold text-foreground">{rounds.length}</span>
            <span className="font-body text-sm text-muted-foreground">Rounds</span>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="flex flex-col items-center">
            <BookOpen className="mb-2 h-8 w-8 text-primary" />
            <span className="font-display text-3xl font-bold text-foreground">{totalQuestions}</span>
            <span className="font-body text-sm text-muted-foreground">Questions</span>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="flex flex-col items-center">
            <Trophy className="mb-2 h-8 w-8 text-warning" />
            <span className="font-display text-3xl font-bold text-foreground">{totalPoints}</span>
            <span className="font-body text-sm text-muted-foreground">Total Points</span>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div 
          className="flex flex-col gap-4 sm:flex-row"
          variants={itemVariants}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <Button
              onClick={startQuiz}
              className="group relative overflow-hidden border-2 border-primary bg-primary/10 px-12 py-8 font-display text-xl uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Play className="h-6 w-6" />
                Start Quiz
              </span>
            </Button>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <Button
              onClick={toggleEditMode}
              variant="outline"
              className="border-2 border-muted-foreground/30 px-8 py-8 font-display text-lg uppercase tracking-wider text-muted-foreground hover:border-accent hover:text-accent"
            >
              <Settings className="mr-2 h-5 w-5" />
              Edit Quiz
            </Button>
          </motion.div>
        </motion.div>

        {/* Footer hint */}
        <motion.p 
          className="mt-12 text-center font-body text-sm text-muted-foreground/60"
          variants={itemVariants}
        >
          60 seconds per question • Instant feedback
        </motion.p>
      </motion.div>
    </SlideLayout>
  );
};

export default HomeSlide;
