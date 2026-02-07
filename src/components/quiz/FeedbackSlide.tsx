import React, { useEffect } from 'react';
import { useQuiz, useQuizStatic } from '@/context/QuizContext';
import { useAudio } from '@/context/AudioContext';
import SlideLayout from './SlideLayout';
import Confetti from './Confetti';
import MediaDisplay from './MediaDisplay';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, LayoutGrid, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeedbackSlideProps {
  type: 'correct' | 'wrong';
}

const FeedbackSlide: React.FC<FeedbackSlideProps> = ({ type }) => {
  // Use static snapshot to prevent flash of next question's answer during exit animation
  const { question: frozenQuestion, roundLength, questionIndex: frozenQuestionIndex } = useQuizStatic();
  
  const { 
    currentRound,
    continueAfterFeedback, 
    resetQuestion,
    goToSlide,
    lastQuestionResult
  } = useQuiz();
  
  const { playClick, playCorrect, playIncorrect } = useAudio();

  const isCorrect = type === 'correct';
  const isLastQuestionInRound = roundLength > 0 && frozenQuestionIndex === roundLength - 1;
  
  // Check if this is a media question with a second (revealed) image
  const isMediaQuestion = frozenQuestion?.questionType === 'media';
  const hasRevealedMedia = isMediaQuestion && 
    frozenQuestion?.mediaAttachments && 
    frozenQuestion.mediaAttachments.length >= 2;

  // Play sound effect on mount
  useEffect(() => {
    if (isCorrect) {
      playCorrect();
    } else {
      playIncorrect();
    }
  }, [isCorrect, playCorrect, playIncorrect]);

  // Auto-advance after correct answer
  useEffect(() => {
    if (isCorrect) {
      const timer = setTimeout(() => {
        continueAfterFeedback();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isCorrect, continueAfterFeedback]);

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
                  duration: 0.6, 
                  repeat: 3,
                  ease: [0.4, 0, 0.2, 1] as const 
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
            
            {/* Points earned */}
            <motion.div 
              className="mb-10 rounded-lg border-2 border-success bg-success/10 px-8 py-4"
              variants={itemVariants}
            >
              <motion.span 
                className="font-display text-4xl font-bold text-success"
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                +{lastQuestionResult?.points || frozenQuestion.points} points
              </motion.span>
            </motion.div>

            {/* Explanation if available */}
            {frozenQuestion.explanation && (
              <motion.div 
                className="mb-8 max-w-2xl border-l-4 border-success bg-card/60 p-4"
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

            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
            >
              <Button
                onClick={handleContinue}
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
                scale: { type: 'spring', stiffness: 150, damping: 12 },
                x: { duration: 0.6, delay: 0.4 }
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

            {/* Show negative points if applicable */}
            {lastQuestionResult?.negativePoints && lastQuestionResult.negativePoints > 0 && (
              <motion.div 
                className="mb-4 flex items-center gap-2 rounded-lg border-2 border-destructive bg-destructive/10 px-6 py-3"
                variants={itemVariants}
              >
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="font-display text-2xl font-bold text-destructive">
                  -{lastQuestionResult.negativePoints} points
                </span>
              </motion.div>
            )}
            
            <motion.p 
              className="mb-6 text-center font-body text-xl text-muted-foreground"
              variants={itemVariants}
            >
              The correct answer was:
            </motion.p>

            {/* Show correct answer */}
            <motion.div 
              className="mb-6 rounded-lg border-2 border-success bg-success/10 px-8 py-6"
              variants={itemVariants}
            >
              <span className="font-display text-2xl font-bold text-success">
                [{frozenQuestion.correctAnswer}] {frozenQuestion.options.find(o => o.label === frozenQuestion.correctAnswer)?.text}
              </span>
            </motion.div>

            {/* Show revealed media for wrong answers (second/clear image) */}
            {hasRevealedMedia && (
              <motion.div 
                className="mb-8 w-full max-w-2xl"
                variants={itemVariants}
              >
                <p className="mb-3 text-center font-body text-sm text-muted-foreground">
                  Revealed Image:
                </p>
                <MediaDisplay 
                  attachments={frozenQuestion.mediaAttachments!}
                  showRevealedOnly={true}
                />
              </motion.div>
            )}

            {/* Explanation if available */}
            {frozenQuestion.explanation && (
              <motion.div 
                className="mb-8 max-w-2xl border-l-4 border-primary bg-card/60 p-4"
                variants={itemVariants}
              >
                <p className="font-body text-foreground">{frozenQuestion.explanation}</p>
              </motion.div>
            )}

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
