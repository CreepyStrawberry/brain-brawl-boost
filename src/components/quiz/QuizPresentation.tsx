import React, { useEffect } from 'react';
import { useQuiz } from '@/context/QuizContext';
import CoverSlide from './CoverSlide';
import RoundIntroSlide from './RoundIntroSlide';
import QuestionSlide from './QuestionSlide';
import ScoreboardSlide from './ScoreboardSlide';
import CompleteSlide from './CompleteSlide';

const QuizPresentation: React.FC = () => {
  const { currentSlide, goToSlide, nextQuestion } = useQuiz();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        if (currentSlide === 'cover') {
          goToSlide('round-intro');
        } else if (currentSlide === 'round-intro') {
          goToSlide('question');
        }
      } else if (e.key === 'ArrowRight') {
        if (currentSlide === 'question') {
          nextQuestion();
        }
      } else if (e.key === 's' || e.key === 'S') {
        goToSlide('scoreboard');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, goToSlide, nextQuestion]);

  switch (currentSlide) {
    case 'cover':
      return <CoverSlide />;
    case 'round-intro':
      return <RoundIntroSlide />;
    case 'question':
      return <QuestionSlide />;
    case 'scoreboard':
      return <ScoreboardSlide />;
    case 'complete':
      return <CompleteSlide />;
    default:
      return <CoverSlide />;
  }
};

export default QuizPresentation;
