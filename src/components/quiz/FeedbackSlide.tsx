import React, { useEffect } from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from './SlideLayout';
import Confetti from './Confetti';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeedbackSlideProps {
  type: 'correct' | 'wrong';
}

const FeedbackSlide: React.FC<FeedbackSlideProps> = ({ type }) => {
  const { 
    currentRound,
    currentQuestionIndex,
    currentQuestion, 
    continueAfterFeedback, 
    resetQuestion,
    goToSlide,
    score 
  } = useQuiz();

  const isCorrect = type === 'correct';
  const isLastQuestionInRound = currentRound && currentQuestionIndex === currentRound.questions.length - 1;

  // Auto-advance after correct answer
  useEffect(() => {
    if (isCorrect) {
      const timer = setTimeout(() => {
        continueAfterFeedback();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isCorrect, continueAfterFeedback]);

  if (!currentQuestion) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const }
    },
  };

  return (
    <SlideLayout>
      <Confetti show={isCorrect} />
      
      <motion.div 
        className="flex flex-1 flex-col items-center justify-center px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {isCorrect ? (
          <>
            {/* Success icon with bounce */}
            <motion.div 
              className="mb-6"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 0.5, 
                  repeat: 3,
                  ease: 'easeInOut' 
                }}
              >
                <CheckCircle className="h-32 w-32 text-success" />
              </motion.div>
            </motion.div>
            
            {/* Success message */}
            <motion.h1 
              className="mb-4 text-center font-display text-5xl font-black uppercase text-success md:text-7xl"
              variants={itemVariants}
              style={{
                textShadow: '0 0 20px hsl(150 85% 45% / 0.5), 0 0 40px hsl(150 85% 45% / 0.3)',
              }}
            >
              Correct!
            </motion.h1>
            
            <motion.p 
              className="mb-8 text-center font-display text-2xl text-primary"
              variants={itemVariants}
            >
              +{currentQuestion.points} points
            </motion.p>

            {/* Score display */}
            <motion.div 
              className="mb-10 rounded-lg border-2 border-success bg-success/10 px-8 py-4"
              variants={itemVariants}
            >
              <span className="font-body text-lg text-muted-foreground">Total Score: </span>
              <motion.span 
                className="font-display text-3xl font-bold text-success"
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                {score}
              </motion.span>
            </motion.div>

            {/* Explanation if available */}
            {currentQuestion.explanation && (
              <motion.div 
                className="mb-8 max-w-2xl border-l-4 border-success bg-card/60 p-4"
                variants={itemVariants}
              >
                <p className="font-body text-foreground">{currentQuestion.explanation}</p>
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

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={continueAfterFeedback}
                className="border-2 border-success bg-success/10 px-8 py-6 font-display text-lg uppercase tracking-wider text-success hover:bg-success hover:text-success-foreground"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </>
        ) : (
          <>
            {/* Failure icon with shake */}
            <motion.div 
              className="mb-6"
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1,
                x: [0, -10, 10, -10, 10, 0],
              }}
              transition={{ 
                scale: { type: 'spring', stiffness: 200, damping: 10 },
                x: { duration: 0.5, delay: 0.3 }
              }}
            >
              <XCircle className="h-32 w-32 text-destructive" />
            </motion.div>
            
            {/* Failure message */}
            <motion.h1 
              className="mb-4 text-center font-display text-5xl font-black uppercase text-destructive md:text-7xl"
              variants={itemVariants}
              style={{
                textShadow: '0 0 20px hsl(0 85% 55% / 0.5)',
              }}
            >
              Wrong!
            </motion.h1>
            
            <motion.p 
              className="mb-8 text-center font-body text-xl text-muted-foreground"
              variants={itemVariants}
            >
              The correct answer was:
            </motion.p>

            {/* Show correct answer */}
            <motion.div 
              className="mb-10 rounded-lg border-2 border-success bg-success/10 px-8 py-6"
              variants={itemVariants}
            >
              <span className="font-display text-2xl font-bold text-success">
                [{currentQuestion.correctAnswer}] {currentQuestion.options.find(o => o.label === currentQuestion.correctAnswer)?.text}
              </span>
            </motion.div>

            {/* Explanation if available */}
            {currentQuestion.explanation && (
              <motion.div 
                className="mb-8 max-w-2xl border-l-4 border-primary bg-card/60 p-4"
                variants={itemVariants}
              >
                <p className="font-body text-foreground">{currentQuestion.explanation}</p>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-4"
              variants={itemVariants}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={resetQuestion}
                  variant="outline"
                  className="border-2 border-muted-foreground/30 px-6 py-6 font-display uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Try Again
                </Button>
              </motion.div>
              {isLastQuestionInRound && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => goToSlide('rounds')}
                    variant="outline"
                    className="border-2 border-accent/50 px-6 py-6 font-display uppercase tracking-wider text-accent hover:border-accent hover:bg-accent/10"
                  >
                    <LayoutGrid className="mr-2 h-5 w-5" />
                    Rounds
                  </Button>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={continueAfterFeedback}
                  className="border-2 border-primary bg-primary/10 px-8 py-6 font-display text-lg uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </>
        )}
      </motion.div>
    </SlideLayout>
  );
};

export default FeedbackSlide;
