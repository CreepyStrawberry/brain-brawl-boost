import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import HomeSlide from './HomeSlide';
import QuestionSlide from './QuestionSlide';
import CompleteSlide from './CompleteSlide';

const QuizPresentation: React.FC = () => {
  const { currentSlide } = useQuiz();

  switch (currentSlide) {
    case 'home':
      return <HomeSlide />;
    case 'question':
      return <QuestionSlide />;
    case 'complete':
      return <CompleteSlide />;
    default:
      return <HomeSlide />;
  }
};

export default QuizPresentation;
