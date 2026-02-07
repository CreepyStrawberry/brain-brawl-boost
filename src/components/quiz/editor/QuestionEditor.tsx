 import React, { useState, useRef, useEffect } from 'react';
import { useQuiz } from '@/context/QuizContext';
import SlideLayout from '../SlideLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Trash2, Check, Image, Video, Music, X, Clock } from 'lucide-react';
import { Question, QuestionType, MediaAttachment } from '@/types/quiz';
 import { storeMediaFile, getMediaFile, deleteMediaFile } from '@/lib/mediaStorage';

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
  const [questionType, setQuestionType] = useState<QuestionType>(question.questionType || 'normal');
  const [mediaAttachments, setMediaAttachments] = useState<MediaAttachment[]>(question.mediaAttachments || []);
  const [timeLimit, setTimeLimit] = useState(question.timeLimit || 60);
  const [negativePoints, setNegativePoints] = useState(question.negativePoints || 0);
   const [mediaPreviewUrls, setMediaPreviewUrls] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
 
   // Load media preview URLs from IndexedDB on mount
   useEffect(() => {
     const loadMediaPreviews = async () => {
       const urls: Record<string, string> = {};
       for (const attachment of mediaAttachments) {
         if (attachment.url && !attachment.url.startsWith('blob:')) {
           const media = await getMediaFile(attachment.url);
           if (media) {
             urls[attachment.url] = media.dataUrl;
           }
         } else if (attachment.url.startsWith('blob:')) {
           // Blob URLs are temporary, keep them as-is for preview
           urls[attachment.url] = attachment.url;
         }
       }
       setMediaPreviewUrls(urls);
     };
     
     if (mediaAttachments.length > 0) {
       loadMediaPreviews();
     }
   }, []);

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text };
    setOptions(newOptions);
  };

   const handleAddMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    if (mediaAttachments.length >= 2) {
      alert('Maximum 2 media files allowed per question');
      return;
    }

    const file = files[0];
     
     // Store file in IndexedDB and get persistent ID
     const { id, type } = await storeMediaFile(file);
     
     // Get the data URL for preview
     const media = await getMediaFile(id);
     if (media) {
       setMediaPreviewUrls(prev => ({ ...prev, [id]: media.dataUrl }));
     }
     
    const newAttachment: MediaAttachment = {
       url: id, // Store the IndexedDB ID instead of blob URL
      type,
      isBlurred: mediaAttachments.length === 0, // First image is blurred
    };
    
    setMediaAttachments([...mediaAttachments, newAttachment]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

   const handleRemoveMedia = async (index: number) => {
     const attachment = mediaAttachments[index];
     if (attachment) {
       await deleteMediaFile(attachment.url);
       setMediaPreviewUrls(prev => {
         const newUrls = { ...prev };
         delete newUrls[attachment.url];
         return newUrls;
       });
     }
    setMediaAttachments(mediaAttachments.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const updatedQuestion: Question = {
      ...question,
      questionText,
      options,
      correctAnswer,
      points,
      negativePoints: negativePoints > 0 ? negativePoints : undefined,
      explanation: explanation || undefined,
      questionType,
      mediaAttachments: questionType === 'media' ? mediaAttachments : undefined,
      timeLimit,
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

  const getMediaIcon = (type: 'image' | 'audio' | 'video') => {
    switch (type) {
      case 'audio': return <Music className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      default: return <Image className="h-5 w-5" />;
    }
  };

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
            {/* Question Type Selector */}
            <div className="cyber-border bg-card/60 p-6">
              <Label className="font-display text-sm uppercase tracking-wider text-foreground">
                Question Type
              </Label>
              <Select value={questionType} onValueChange={(v) => setQuestionType(v as QuestionType)}>
                <SelectTrigger className="mt-2 border-2 border-primary/30 bg-background/50">
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal Question</SelectItem>
                  <SelectItem value="media">Audio / Video / Image Question</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Time Limit */}
            <div className="cyber-border bg-card/60 p-6">
              <Label className="font-display text-sm uppercase tracking-wider text-foreground">
                <Clock className="mr-2 inline h-4 w-4" />
                Time Limit (seconds)
              </Label>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {[30, 45, 60, 90, 120].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTimeLimit(value)}
                    className={`rounded border-2 px-4 py-2 font-display font-bold transition-all ${
                      timeLimit === value
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-muted bg-muted/10 text-muted-foreground hover:border-primary hover:text-primary'
                    }`}
                  >
                    {value}s
                  </button>
                ))}
                <Input
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) || 60)}
                  className="w-24 border-2 border-primary/30 bg-background/50 text-center font-display font-bold text-foreground"
                  min={10}
                  max={300}
                />
              </div>
            </div>

            {/* Media Attachments (only for media questions) */}
            {questionType === 'media' && (
              <div className="cyber-border bg-card/60 p-6">
                <Label className="font-display text-sm uppercase tracking-wider text-foreground">
                  Media Attachments (Max 2)
                </Label>
                <p className="mb-4 font-body text-sm text-muted-foreground">
                  First media shows initially (blurred if image). Second shows after wrong answer.
                </p>
                
                <div className="space-y-3">
                  {mediaAttachments.map((media, index) => (
                    <div key={index} className="flex items-center gap-3 rounded border-2 border-muted bg-muted/10 p-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded ${
                        media.type === 'image' ? 'bg-blue-500/20 text-blue-500' :
                        media.type === 'audio' ? 'bg-purple-500/20 text-purple-500' :
                        'bg-orange-500/20 text-orange-500'
                      }`}>
                        {getMediaIcon(media.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {media.type.charAt(0).toUpperCase() + media.type.slice(1)} {index + 1}
                          {index === 0 && media.type === 'image' && (
                            <span className="ml-2 text-xs text-muted-foreground">(Shows blurred initially)</span>
                          )}
                          {index === 1 && (
                            <span className="ml-2 text-xs text-muted-foreground">(Revealed after wrong answer)</span>
                          )}
                        </p>
                        {media.type === 'image' && (
                           <img src={mediaPreviewUrls[media.url] || media.url} alt={`Media ${index + 1}`} className="mt-2 h-20 w-auto rounded object-cover" />
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveMedia(index)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {mediaAttachments.length < 2 && (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,audio/*,video/*"
                        onChange={handleAddMedia}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-dashed border-muted-foreground/50 text-muted-foreground hover:border-primary hover:text-primary"
                      >
                        <Image className="mr-2 h-4 w-4" />
                        Add Media File
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

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
                Points for Correct Answer
              </Label>
              <div className="mt-3 flex flex-wrap items-center gap-3">
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
                    +{value}
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

            {/* Negative Points (Optional) */}
            <div className="cyber-border bg-card/60 p-6">
              <Label className="font-display text-sm uppercase tracking-wider text-foreground">
                Negative Marking (Optional)
              </Label>
              <p className="mb-3 font-body text-sm text-muted-foreground">
                Deduct points for wrong answers. Set to 0 to disable.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {[0, 2, 5, 10].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setNegativePoints(value)}
                    className={`rounded border-2 px-4 py-2 font-display font-bold transition-all ${
                      negativePoints === value
                        ? value === 0 
                          ? 'border-muted bg-muted/20 text-muted-foreground'
                          : 'border-destructive bg-destructive/20 text-destructive'
                        : 'border-muted bg-muted/10 text-muted-foreground hover:border-destructive hover:text-destructive'
                    }`}
                  >
                    {value === 0 ? 'None' : `-${value}`}
                  </button>
                ))}
                <Input
                  type="number"
                  value={negativePoints}
                  onChange={(e) => setNegativePoints(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 border-2 border-destructive/30 bg-background/50 text-center font-display font-bold text-foreground"
                  min={0}
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
                <div className="mb-2 flex items-center gap-2">
                  <span className={`rounded px-2 py-1 text-xs font-bold ${
                    questionType === 'media' ? 'bg-purple-500/20 text-purple-400' : 'bg-primary/20 text-primary'
                  }`}>
                    {questionType === 'media' ? 'Media Question' : 'Normal Question'}
                  </span>
                  <span className="rounded bg-muted/20 px-2 py-1 text-xs text-muted-foreground">
                    {timeLimit}s
                  </span>
                </div>
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