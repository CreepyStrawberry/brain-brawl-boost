import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from './SlideLayout';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const RoundIntroSlide: React.FC = () => {
  const { goToSlide, questions, currentQuestionIndex } = useQuiz();
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SlideLayout>
      <div className="flex flex-1 flex-col px-8 py-12">
        {/* Header */}
        <div className="mb-12 flex items-center gap-4">
          <div className="cyber-border bg-card/50 px-6 py-3">
            <h1 className="cyber-text-glow font-display text-3xl font-bold uppercase tracking-wider text-primary md:text-4xl">
              {currentQuestion.roundName}
            </h1>
          </div>
          <div className="ml-4 flex h-12 w-12 items-center justify-center border-2 border-accent bg-accent/20">
            <span className="font-display text-xl font-bold text-accent">R1</span>
          </div>
          <div className="ml-auto font-display text-xl uppercase tracking-widest text-muted-foreground">
            Establishing The Handshake
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl">
          <p className="mb-8 font-body text-xl leading-relaxed text-foreground/90">
            The foundation of our connected world rests upon the invisible threads of networking protocols. 
            In this round, we strip back the user interface to examine the raw mechanics of data transmission, 
            packet switching, and the architectural hierarchies of the OSI model.
          </p>
          
          <p className="mb-8 font-body text-xl leading-relaxed text-foreground/90">
            Candidates must demonstrate an intuitive understanding of how information traverses the global web, 
            ensuring integrity, speed, and security. Accuracy here is paramount, as even a single dropped packet 
            can lead to systemic failure.
          </p>
          
          <p className="font-body text-xl leading-relaxed text-primary">
            Prepare your stations for a deep dive into the conduits of modern civilization.
          </p>
        </div>

        {/* Navigation */}
        <div className="mt-auto flex items-center justify-between pt-12">
          <Button
            variant="outline"
            onClick={() => goToSlide('cover')}
            className="border-2 border-muted-foreground/30 px-6 py-4 font-display uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Back
          </Button>
          
          <Button
            onClick={() => goToSlide('question')}
            className="border-2 border-primary bg-primary/10 px-8 py-4 font-display uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            Start Round
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </SlideLayout>
  );
};

export default RoundIntroSlide;
