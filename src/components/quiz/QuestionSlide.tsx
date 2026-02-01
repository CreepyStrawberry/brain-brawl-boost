import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from './SlideLayout';
import Timer from './Timer';
import OptionButton from './OptionButton';
import Confetti from './Confetti';
import ScorePopup from './ScorePopup';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, RotateCcw, Home, LayoutGrid } from 'lucide-react';

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

  return (
    <SlideLayout>
      <Confetti show={showCelebration} />
      <ScorePopup points={currentQuestion.points} show={showCelebration} />
      
      <div className="flex flex-1 flex-col px-6 py-6 lg:px-12 lg:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="cyber-border bg-card/50 px-4 py-2 lg:px-6 lg:py-3">
            <h2 className="font-display text-lg uppercase tracking-wider text-primary lg:text-xl">
              {currentRound.name}: Question {currentQuestionIndex + 1} of {totalQuestionsInRound}
            </h2>
            <p className="font-body text-sm text-muted-foreground">{currentRound.theme}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="border-2 border-muted bg-muted/20 px-4 py-2">
              <span className="font-body text-sm text-muted-foreground">Score: </span>
              <span className="font-display text-xl font-bold text-primary">{score}</span>
            </div>
            <div className="border-2 border-accent bg-accent/10 px-4 py-2">
              <span className="font-display text-lg font-bold text-accent">+{currentQuestion.points} pts</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Question and options */}
          <div className="flex-1">
            {/* Question box */}
            <div className="cyber-border mb-6 bg-card/60 p-6 lg:mb-8 lg:p-8">
              <p className="font-body text-xl leading-relaxed text-foreground lg:text-2xl">
                {currentQuestion.questionText}
              </p>
            </div>

            {/* Options grid */}
            <div className="grid gap-3 lg:grid-cols-2 lg:gap-4">
              {currentQuestion.options.map((option) => (
                <OptionButton
                  key={option.label}
                  label={option.label}
                  text={option.text}
                  isSelected={selectedAnswer === option.label}
                  isCorrect={isCorrect}
                  isRevealed={answerRevealed}
                  correctAnswer={currentQuestion.correctAnswer}
                  onClick={() => selectAnswer(option.label)}
                  disabled={answerRevealed}
                />
              ))}
            </div>

            {/* Explanation */}
            {answerRevealed && currentQuestion.explanation && (
              <div className="mt-6 border-l-4 border-success bg-success/10 p-4">
                <p className="font-body text-foreground">{currentQuestion.explanation}</p>
              </div>
            )}
          </div>

          {/* Timer sidebar */}
          <div className="flex flex-col items-center lg:w-48">
            <Timer />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          {/* Left controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetQuiz}
              className="border-muted-foreground/30 text-muted-foreground hover:border-destructive hover:text-destructive"
            >
              <Home className="mr-2 h-4 w-4" />
              Exit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToSlide('rounds')}
              className="border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary"
            >
              <LayoutGrid className="mr-2 h-4 w-4" />
              Rounds
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetQuestion}
              className="border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="font-body text-sm text-muted-foreground">
            Overall: {overallQuestionNumber} / {totalQuestions}
          </div>

          {/* Navigation controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentRoundIndex === 0 && currentQuestionIndex === 0}
              className="border-muted-foreground/30 px-4 text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={nextQuestion}
              className="border-2 border-primary bg-primary/10 px-6 font-display uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
            >
              {currentRoundIndex === rounds.length - 1 && currentQuestionIndex === totalQuestionsInRound - 1 ? 'Finish' : 'Next'}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
};

export default QuestionSlide;
