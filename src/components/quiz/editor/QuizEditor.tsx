import React, { useState } from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from '../SlideLayout';
import RoundEditor from './RoundEditor';
import QuestionEditor from './QuestionEditor';
import { Button } from '@/components/ui/button';
import { Plus, Home, ChevronRight, Trash2, Edit2, GripVertical } from 'lucide-react';
import { Round, Question } from '@/types/quiz';

const QuizEditor: React.FC = () => {
  const { rounds, toggleEditMode, addRound, deleteRound } = useQuiz();
  const [selectedRoundIndex, setSelectedRoundIndex] = useState<number | null>(null);
  const [editingRound, setEditingRound] = useState<{ index: number; round: Round } | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<{ roundIndex: number; questionIndex: number; question: Question } | null>(null);

  const handleAddRound = () => {
    const newRound: Round = {
      id: Date.now().toString(),
      name: `Round ${rounds.length + 1}`,
      theme: 'New Theme',
      questions: [],
    };
    setEditingRound({ index: rounds.length, round: newRound });
  };

  const handleEditRound = (index: number) => {
    setEditingRound({ index, round: { ...rounds[index] } });
  };

  const handleDeleteRound = (index: number) => {
    if (confirm('Are you sure you want to delete this round and all its questions?')) {
      deleteRound(index);
      if (selectedRoundIndex === index) {
        setSelectedRoundIndex(null);
      }
    }
  };

  const handleAddQuestion = (roundIndex: number) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      questionText: '',
      options: [
        { label: 'A', text: '' },
        { label: 'B', text: '' },
        { label: 'C', text: '' },
        { label: 'D', text: '' },
      ],
      correctAnswer: 'A',
      points: 10,
    };
    setEditingQuestion({ roundIndex, questionIndex: -1, question: newQuestion });
  };

  if (editingRound) {
    return (
      <RoundEditor
        round={editingRound.round}
        isNew={editingRound.index >= rounds.length}
        onSave={() => setEditingRound(null)}
        onCancel={() => setEditingRound(null)}
        roundIndex={editingRound.index}
      />
    );
  }

  if (editingQuestion) {
    return (
      <QuestionEditor
        question={editingQuestion.question}
        roundIndex={editingQuestion.roundIndex}
        questionIndex={editingQuestion.questionIndex}
        isNew={editingQuestion.questionIndex === -1}
        onSave={() => setEditingQuestion(null)}
        onCancel={() => setEditingQuestion(null)}
      />
    );
  }

  return (
    <SlideLayout>
      <div className="flex flex-1 flex-col px-6 py-8 lg:px-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="cyber-text-glow font-display text-3xl font-bold uppercase text-primary lg:text-4xl">
              Quiz Editor
            </h1>
            <p className="mt-1 font-body text-muted-foreground">
              Manage rounds and questions
            </p>
          </div>
          <Button
            onClick={toggleEditMode}
            className="border-2 border-primary bg-primary/10 px-6 py-4 font-display uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Home className="mr-2 h-4 w-4" />
            Done Editing
          </Button>
        </div>

        {/* Main content */}
        <div className="flex flex-1 gap-6">
          {/* Rounds list */}
          <div className="w-80 shrink-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg uppercase tracking-wider text-foreground">
                Rounds
              </h2>
              <Button
                onClick={handleAddRound}
                size="sm"
                className="border border-accent bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {rounds.map((round, index) => (
                <div
                  key={round.id}
                  className={`group cyber-border cursor-pointer bg-card/60 p-4 transition-all hover:bg-card/80 ${
                    selectedRoundIndex === index ? 'border-primary' : ''
                  }`}
                  onClick={() => setSelectedRoundIndex(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <h3 className="font-display text-sm font-bold text-foreground">
                          {round.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">{round.theme}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditRound(index);
                        }}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRound(index);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {round.questions.length} questions • {round.questions.reduce((sum, q) => sum + q.points, 0)} pts
                  </p>
                </div>
              ))}

              {rounds.length === 0 && (
                <div className="rounded border-2 border-dashed border-muted p-8 text-center">
                  <p className="text-muted-foreground">No rounds yet</p>
                  <Button
                    onClick={handleAddRound}
                    variant="link"
                    className="mt-2 text-primary"
                  >
                    Create your first round
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Questions list */}
          <div className="flex-1">
            {selectedRoundIndex !== null && rounds[selectedRoundIndex] && (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-lg uppercase tracking-wider text-foreground">
                    Questions in {rounds[selectedRoundIndex].name}
                  </h2>
                  <Button
                    onClick={() => handleAddQuestion(selectedRoundIndex)}
                    size="sm"
                    className="border border-accent bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Question
                  </Button>
                </div>

                <div className="space-y-3">
                  {rounds[selectedRoundIndex].questions.map((question, qIndex) => (
                    <div
                      key={question.id}
                      className="group cyber-border flex cursor-pointer items-center gap-4 bg-card/60 p-4 transition-all hover:bg-card/80"
                      onClick={() => setEditingQuestion({ 
                        roundIndex: selectedRoundIndex, 
                        questionIndex: qIndex, 
                        question: { ...question } 
                      })}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-primary/50 bg-primary/10 font-display text-lg font-bold text-primary">
                        {qIndex + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-body text-foreground">
                          {question.questionText || 'Empty question'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Answer: [{question.correctAnswer}] • {question.points} pts
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-primary"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {rounds[selectedRoundIndex].questions.length === 0 && (
                    <div className="rounded border-2 border-dashed border-muted p-8 text-center">
                      <p className="text-muted-foreground">No questions in this round</p>
                      <Button
                        onClick={() => handleAddQuestion(selectedRoundIndex)}
                        variant="link"
                        className="mt-2 text-primary"
                      >
                        Add your first question
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            {selectedRoundIndex === null && (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">Select a round to view questions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SlideLayout>
  );
};

export default QuizEditor;
