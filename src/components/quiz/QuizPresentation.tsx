import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import HomeSlide from './HomeSlide';
import RoundSelectionSlide from './RoundSelectionSlide';
import QuestionSlide from './QuestionSlide';
import FeedbackSlide from './FeedbackSlide';
import CompleteSlide from './CompleteSlide';
import RoundCompleteSlide from './RoundCompleteSlide';
import QuizEditor from './editor/QuizEditor';

const QuizPresentation: React.FC = () => {
  const { currentSlide } = useQuiz();

  switch (currentSlide) {
    case 'home':
      return <HomeSlide />;
    case 'rounds':
      return <RoundSelectionSlide />;
    case 'question':
      return <QuestionSlide />;
    case 'correct':
      return <FeedbackSlide type="correct" />;
    case 'wrong':
      return <FeedbackSlide type="wrong" />;
    case 'round-complete':
      return <RoundCompleteSlide />;
    case 'complete':
      return <CompleteSlide />;
    case 'editor':
      return <QuizEditor />;
    default:
      return <HomeSlide />;
  }
};

export default QuizPresentation;
