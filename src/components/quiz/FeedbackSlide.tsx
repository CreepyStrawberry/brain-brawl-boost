import React, { useEffect } from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from './SlideLayout';
import Confetti from './Confetti';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface FeedbackSlideProps {
  type: 'correct' | 'wrong';
}

const FeedbackSlide: React.FC<FeedbackSlideProps> = ({ type }) => {
  const { 
    currentQuestion, 
    continueAfterFeedback, 
    resetQuestion,
    score 
  } = useQuiz();

  const isCorrect = type === 'correct';

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

  return (
    <SlideLayout>
      <Confetti show={isCorrect} />
      
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {isCorrect ? (
          <>
            {/* Success icon */}
            <div className="mb-6 animate-scale-in">
              <CheckCircle className="h-32 w-32 text-success" />
            </div>
            
            {/* Success message */}
            <h1 className="mb-4 text-center font-display text-5xl font-black uppercase text-success md:text-7xl animate-fade-in">
              Correct!
            </h1>
            
            <p className="mb-8 text-center font-display text-2xl text-primary">
              +{currentQuestion.points} points
            </p>

            {/* Score display */}
            <div className="mb-10 rounded-lg border-2 border-success bg-success/10 px-8 py-4">
              <span className="font-body text-lg text-muted-foreground">Total Score: </span>
              <span className="font-display text-3xl font-bold text-success">{score}</span>
            </div>

            {/* Explanation if available */}
            {currentQuestion.explanation && (
              <div className="mb-8 max-w-2xl border-l-4 border-success bg-card/60 p-4">
                <p className="font-body text-foreground">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Auto-advance hint */}
            <p className="mb-6 text-center font-body text-sm text-muted-foreground animate-pulse">
              Moving to next question...
            </p>

            <Button
              onClick={continueAfterFeedback}
              className="border-2 border-success bg-success/10 px-8 py-6 font-display text-lg uppercase tracking-wider text-success hover:bg-success hover:text-success-foreground"
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </>
        ) : (
          <>
            {/* Failure icon */}
            <div className="mb-6 animate-shake">
              <XCircle className="h-32 w-32 text-destructive" />
            </div>
            
            {/* Failure message */}
            <h1 className="mb-4 text-center font-display text-5xl font-black uppercase text-destructive md:text-7xl animate-fade-in">
              Wrong!
            </h1>
            
            <p className="mb-8 text-center font-body text-xl text-muted-foreground">
              The correct answer was:
            </p>

            {/* Show correct answer */}
            <div className="mb-10 rounded-lg border-2 border-success bg-success/10 px-8 py-6">
              <span className="font-display text-2xl font-bold text-success">
                [{currentQuestion.correctAnswer}] {currentQuestion.options.find(o => o.label === currentQuestion.correctAnswer)?.text}
              </span>
            </div>

            {/* Explanation if available */}
            {currentQuestion.explanation && (
              <div className="mb-8 max-w-2xl border-l-4 border-primary bg-card/60 p-4">
                <p className="font-body text-foreground">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button
                onClick={resetQuestion}
                variant="outline"
                className="border-2 border-muted-foreground/30 px-6 py-6 font-display uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Try Again
              </Button>
              <Button
                onClick={continueAfterFeedback}
                className="border-2 border-primary bg-primary/10 px-8 py-6 font-display text-lg uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </>
        )}
      </div>
    </SlideLayout>
  );
};

export default FeedbackSlide;
