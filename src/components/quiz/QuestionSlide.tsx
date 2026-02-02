import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from './SlideLayout';
import Timer from './Timer';
import OptionButton from './OptionButton';
import Confetti from './Confetti';
import ScorePopup from './ScorePopup';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Home, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuestionSlide: React.FC = () => {
  const {
    rounds,
    currentRoundIndex,
    currentQuestionIndex,
    currentRound,
    currentQuestion,
    selectedAnswer,
    answerRevealed,
    isCorrect,
    showCelebration,
    score,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    resetQuestion,
    resetQuiz,
    goToSlide,
  } = useQuiz();

  if (!currentRound || !currentQuestion) {
    return (
      <SlideLayout>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted-foreground">No questions available</p>
        </div>
      </SlideLayout>
    );
  }

  const totalQuestionsInRound = currentRound.questions.length;
  const overallQuestionNumber = rounds
    .slice(0, currentRoundIndex)
    .reduce((sum, r) => sum + r.questions.length, 0) + currentQuestionIndex + 1;
  const totalQuestions = rounds.reduce((sum, r) => sum + r.questions.length, 0);
  const isLastQuestionInRound = currentQuestionIndex === totalQuestionsInRound - 1;
  const isLastRound = currentRoundIndex === rounds.length - 1;

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
      <Confetti show={showCelebration} />
      <ScorePopup points={currentQuestion.points} show={showCelebration} />
      
      <motion.div 
        className="flex flex-1 flex-col px-6 py-6 lg:px-12 lg:py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={`${currentRoundIndex}-${currentQuestionIndex}`}
      >
        {/* Header */}
        <motion.div 
          className="mb-6 flex flex-wrap items-center justify-between gap-4"
          variants={itemVariants}
        >
          <div className="cyber-border bg-card/50 px-4 py-2 lg:px-6 lg:py-3">
            <h2 className="font-display text-lg uppercase tracking-wider text-primary lg:text-xl">
              {currentRound.name}: Question {currentQuestionIndex + 1} of {totalQuestionsInRound}
            </h2>
            <p className="font-body text-sm text-muted-foreground">{currentRound.theme}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.div 
              className="border-2 border-muted bg-muted/20 px-4 py-2"
              animate={{ scale: showCelebration ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="font-body text-sm text-muted-foreground">Score: </span>
              <span className="font-display text-xl font-bold text-primary">{score}</span>
            </motion.div>
            <div className="border-2 border-accent bg-accent/10 px-4 py-2">
              <span className="font-display text-lg font-bold text-accent">+{currentQuestion.points} pts</span>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Question and options */}
          <div className="flex-1">
            {/* Question box */}
            <motion.div 
              className="cyber-border mb-6 bg-card/60 p-6 lg:mb-8 lg:p-8"
              variants={itemVariants}
            >
              <p className="font-body text-xl leading-relaxed text-foreground lg:text-2xl">
                {currentQuestion.questionText}
              </p>
            </motion.div>

            {/* Options grid */}
            <motion.div 
              className="grid gap-3 lg:grid-cols-2 lg:gap-4"
              variants={containerVariants}
            >
              <AnimatePresence mode="wait">
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={option.label}
                    variants={itemVariants}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <OptionButton
                      label={option.label}
                      text={option.text}
                      isSelected={selectedAnswer === option.label}
                      isCorrect={isCorrect}
                      isRevealed={answerRevealed}
                      correctAnswer={currentQuestion.correctAnswer}
                      onClick={() => selectAnswer(option.label)}
                      disabled={answerRevealed}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Explanation */}
            <AnimatePresence>
              {answerRevealed && currentQuestion.explanation && (
                <motion.div 
                  className="mt-6 border-l-4 border-success bg-success/10 p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="font-body text-foreground">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Timer sidebar */}
          <motion.div 
            className="flex flex-col items-center lg:w-48"
            variants={itemVariants}
          >
            <Timer />
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div 
          className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6"
          variants={itemVariants}
        >
          {/* Left controls */}
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={resetQuiz}
                className="border-muted-foreground/30 text-muted-foreground hover:border-destructive hover:text-destructive"
              >
                <Home className="mr-2 h-4 w-4" />
                Exit
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToSlide('rounds')}
                className="border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary"
              >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Rounds
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={resetQuestion}
                className="border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          {/* Progress indicator */}
          <div className="font-body text-sm text-muted-foreground">
            Overall: {overallQuestionNumber} / {totalQuestions}
          </div>

          {/* Navigation controls */}
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentRoundIndex === 0 && currentQuestionIndex === 0}
                className="border-muted-foreground/30 px-4 text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={nextQuestion}
                className="border-2 border-primary bg-primary/10 px-6 font-display uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
              >
                {isLastRound && isLastQuestionInRound ? 'Finish' : 'Next'}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </SlideLayout>
  );
};

export default QuestionSlide;
