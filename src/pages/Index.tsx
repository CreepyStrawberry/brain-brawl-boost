import { QuizProvider } from '@/context/QuizContext';
import QuizPresentation from '@/components/quiz/QuizPresentation';

const Index = () => {
  return (
    <QuizProvider>
      <QuizPresentation />
    </QuizProvider>
  );
};

export default Index;
