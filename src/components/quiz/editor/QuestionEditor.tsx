import React, { useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from '../SlideLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, Trash2, Check } from 'lucide-react';
import { Question } from '@/types/quiz';

interface QuestionEditorProps {
  question: Question;
  roundIndex: number;
  questionIndex: number;
  isNew: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  roundIndex,
  questionIndex,
  isNew,
  onSave,
  onCancel,
}) => {
  const { addQuestion, updateQuestion, deleteQuestion } = useQuiz();
  
  const [questionText, setQuestionText] = useState(question.questionText);
  const [options, setOptions] = useState(question.options);
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer);
  const [points, setPoints] = useState(question.points);
  const [explanation, setExplanation] = useState(question.explanation || '');

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text };
    setOptions(newOptions);
  };

  const handleSave = () => {
    const updatedQuestion: Question = {
      ...question,
      questionText,
      options,
      correctAnswer,
      points,
      explanation: explanation || undefined,
    };

    if (isNew) {
      addQuestion(roundIndex, updatedQuestion);
    } else {
      updateQuestion(roundIndex, questionIndex, updatedQuestion);
    }
    onSave();
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(roundIndex, questionIndex);
      onCancel();
    }
  };

  const isValid = questionText.trim() && options.every(o => o.text.trim());

  return (
    <SlideLayout>
      <div className="flex flex-1 flex-col overflow-hidden px-6 py-8 lg:px-12">
        {/* Header */}
        <div className="mb-6 flex shrink-0 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold uppercase text-primary">
                {isNew ? 'Add Question' : 'Edit Question'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isNew && (
              <Button
                variant="outline"
                onClick={handleDelete}
                className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!isValid}
              className="border-2 border-success bg-success/10 text-success hover:bg-success hover:text-success-foreground"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Question
            </Button>
          </div>
        </div>

        {/* Form - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl space-y-6 pb-8">
            {/* Question text */}
            <div className="cyber-border bg-card/60 p-6">
              <Label className="font-display text-sm uppercase tracking-wider text-foreground">
                Question Text
              </Label>
              <Textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter your question here..."
                className="mt-2 min-h-[120px] border-2 border-primary/30 bg-background/50 font-body text-lg text-foreground focus:border-primary"
              />
            </div>

            {/* Options */}
            <div className="cyber-border bg-card/60 p-6">
              <Label className="font-display text-sm uppercase tracking-wider text-foreground">
                Answer Options
              </Label>
              <p className="mb-4 font-body text-sm text-muted-foreground">
                Click on an option to set it as the correct answer
              </p>
              
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={option.label} className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCorrectAnswer(option.label)}
                      className={`flex h-12 w-12 shrink-0 items-center justify-center border-2 font-display text-lg font-bold transition-all ${
                        correctAnswer === option.label
                          ? 'border-success bg-success/30 text-success'
                          : 'border-muted bg-muted/10 text-muted-foreground hover:border-primary hover:text-primary'
                      }`}
                    >
                      {correctAnswer === option.label ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        option.label
                      )}
                    </button>
                    <Input
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${option.label}`}
                      className="flex-1 border-2 border-primary/30 bg-background/50 font-body text-foreground focus:border-primary"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Points */}
            <div className="cyber-border bg-card/60 p-6">
              <Label className="font-display text-sm uppercase tracking-wider text-foreground">
                Points
              </Label>
              <div className="mt-3 flex items-center gap-3">
                {[5, 10, 15, 20, 25, 50].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPoints(value)}
                    className={`rounded border-2 px-4 py-2 font-display font-bold transition-all ${
                      points === value
                        ? 'border-accent bg-accent/20 text-accent'
                        : 'border-muted bg-muted/10 text-muted-foreground hover:border-primary hover:text-primary'
                    }`}
                  >
                    {value}
                  </button>
                ))}
                <Input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(parseInt(e.target.value) || 10)}
                  className="w-24 border-2 border-primary/30 bg-background/50 text-center font-display font-bold text-foreground"
                  min={1}
                />
              </div>
            </div>

            {/* Explanation (optional) */}
            <div className="cyber-border bg-card/60 p-6">
              <Label className="font-display text-sm uppercase tracking-wider text-foreground">
                Explanation (Optional)
              </Label>
              <p className="mb-2 font-body text-sm text-muted-foreground">
                Shown after the answer is revealed
              </p>
              <Textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain why this answer is correct..."
                className="mt-2 min-h-[80px] border-2 border-primary/30 bg-background/50 font-body text-foreground focus:border-primary"
              />
            </div>

            {/* Preview */}
            <div className="cyber-border bg-card/40 p-6">
              <h3 className="mb-4 font-display text-sm uppercase tracking-wider text-muted-foreground">
                Preview
              </h3>
              <div className="cyber-border bg-card/60 p-6">
                <p className="mb-4 font-body text-lg text-foreground">
                  {questionText || 'Your question will appear here...'}
                </p>
                <div className="grid gap-2 md:grid-cols-2">
                  {options.map((option) => (
                    <div
                      key={option.label}
                      className={`flex items-center gap-3 border-2 p-3 transition-all ${
                        correctAnswer === option.label
                          ? 'border-success bg-success/10'
                          : 'border-muted bg-muted/10'
                      }`}
                    >
                      <span className={`font-display font-bold ${
                        correctAnswer === option.label ? 'text-success' : 'text-muted-foreground'
                      }`}>
                        [{option.label}]
                      </span>
                      <span className="font-body text-foreground">
                        {option.text || `Option ${option.label}`}
                      </span>
                      {correctAnswer === option.label && (
                        <Check className="ml-auto h-5 w-5 text-success" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Points: <span className="font-display font-bold text-accent">{points}</span></span>
                  <span className="text-muted-foreground">Correct: <span className="font-display font-bold text-success">[{correctAnswer}]</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
};

export default QuestionEditor;
