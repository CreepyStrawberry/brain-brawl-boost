import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import { useAudio } from '@/context/AudioContext';
import SlideLayout from './SlideLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const QuestionSelectionSlide: React.FC = () => {
  const { 
    currentRound, 
    currentRoundIndex,
    selectQuestion,
    goToSlide,
    answeredQuestions
  } = useQuiz();
  const { playClick, playSelect } = useAudio();

  const handleSelectQuestion = (questionIndex: number) => {
    playSelect();
    selectQuestion(currentRoundIndex, questionIndex);
  };

  const handleBackToRounds = () => {
    playClick();
    goToSlide('rounds');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1] as const,
        staggerChildren: 0.06 
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

  if (!currentRound) {
    return (
      <SlideLayout showAudioControls={false}>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">No round selected</p>
        </div>
      </SlideLayout>
    );
  }

  return (
    <SlideLayout showAudioControls={false}>
      <motion.div 
        className="flex flex-1 flex-col items-center px-4 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="mb-4 w-full max-w-2xl text-center" variants={itemVariants}>
          <h1 className="cyber-text-glow font-display text-2xl font-bold uppercase text-primary">
            {currentRound.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{currentRound.theme}</p>
        </motion.div>

        {/* Question List */}
        <div className="w-full max-w-2xl space-y-2 px-1">
          {currentRound.questions.map((question, index) => {
            const isAnswered = answeredQuestions.has(`${currentRoundIndex}-${index}`);
            
            return (
              <motion.button
                key={question.id}
                onClick={() => handleSelectQuestion(index)}
                className={`group cyber-border flex w-full items-center justify-between bg-card/60 px-4 py-3 text-left transition-all hover:bg-card/80 hover:border-primary ${
                  isAnswered ? 'border-success/30 bg-success/5' : ''
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.01, x: 3 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center border font-display text-sm font-bold ${
                    isAnswered 
                      ? 'border-success/50 bg-success/10 text-success' 
                      : 'border-primary/50 bg-primary/10 text-primary'
                  }`}>
                    {isAnswered ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-sm text-foreground line-clamp-1">
                      {question.questionText}
                    </p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {question.timeLimit || 60}s
                      </span>
                      <span className="text-accent font-medium">+{question.points} pts</span>
                      {question.negativePoints && (
                        <span className="flex items-center gap-1 text-destructive">
                          <AlertTriangle className="h-3 w-3" />
                          -{question.negativePoints}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Play className="h-4 w-4 flex-shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.button>
            );
          })}
        </div>

        {/* Back button */}
        <motion.div className="mt-6" variants={itemVariants}>
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <Button
              variant="outline"
              onClick={handleBackToRounds}
              className="border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Rounds
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </SlideLayout>
  );
};

export default QuestionSelectionSlide;
