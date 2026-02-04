import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import { motion, AnimatePresence } from 'framer-motion';
import HomeSlide from './HomeSlide';
import RoundSelectionSlide from './RoundSelectionSlide';
import QuestionSlide from './QuestionSlide';
import FeedbackSlide from './FeedbackSlide';
import CompleteSlide from './CompleteSlide';
import RoundCompleteSlide from './RoundCompleteSlide';
import QuizEditor from './editor/QuizEditor';

const pageTransition = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
    }
  },
};

const QuizPresentation: React.FC = () => {
  const { currentSlide } = useQuiz();

  const renderSlide = () => {
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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentSlide}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen"
      >
        {renderSlide()}
      </motion.div>
    </AnimatePresence>
  );
};

export default QuizPresentation;
