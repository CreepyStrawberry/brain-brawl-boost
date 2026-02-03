import React from 'react';
import { MediaAttachment } from '@/types/quiz';
import { Image, Video, Music, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaDisplayProps {
  attachments: MediaAttachment[];
  showRevealed: boolean;
  answerRevealed: boolean;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ attachments, showRevealed, answerRevealed }) => {
  if (attachments.length === 0) return null;

  const primaryMedia = attachments[0];
  const revealedMedia = attachments[1];
  
  // Show revealed media if wrong answer and second media exists
  const currentMedia = showRevealed && revealedMedia ? revealedMedia : primaryMedia;
  const isBlurred = !answerRevealed && primaryMedia.isBlurred && currentMedia === primaryMedia;

  const renderMedia = (media: MediaAttachment, blurred: boolean) => {
    switch (media.type) {
      case 'image':
        return (
          <motion.div 
            className="relative overflow-hidden rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={media.url}
              alt="Question media"
              className={`h-auto max-h-80 w-full object-contain transition-all duration-500 ${blurred ? 'blur-xl' : ''}`}
            />
            {blurred && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-background/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center gap-2 rounded-lg bg-card/80 px-4 py-2 text-sm text-muted-foreground">
                  <EyeOff className="h-4 w-4" />
                  Image is blurred until answer
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      
      case 'video':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <video
              src={media.url}
              controls
              className="h-auto max-h-80 w-full rounded-lg"
            >
              Your browser does not support the video tag.
            </video>
          </motion.div>
        );
      
      case 'audio':
        return (
          <motion.div 
            className="flex items-center gap-4 rounded-lg bg-card/60 p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20">
              <Music className="h-8 w-8 text-purple-400" />
            </div>
            <audio
              src={media.url}
              controls
              className="flex-1"
            >
              Your browser does not support the audio element.
            </audio>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="cyber-border bg-card/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {currentMedia.type === 'image' && <Image className="h-4 w-4" />}
          {currentMedia.type === 'video' && <Video className="h-4 w-4" />}
          {currentMedia.type === 'audio' && <Music className="h-4 w-4" />}
          <span className="capitalize">{currentMedia.type} Question</span>
        </div>
        
        {answerRevealed && revealedMedia && (
          <div className="flex items-center gap-2 text-xs text-success">
            <Eye className="h-3 w-3" />
            Revealed
          </div>
        )}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={showRevealed ? 'revealed' : 'initial'}
          initial={{ opacity: 0, x: showRevealed ? 20 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: showRevealed ? -20 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderMedia(currentMedia, isBlurred)}
        </motion.div>
      </AnimatePresence>
      
      {attachments.length === 2 && !answerRevealed && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {primaryMedia.type === 'image' && primaryMedia.isBlurred 
            ? 'Image will be revealed after answering' 
            : 'Second media will show after wrong answer'}
        </p>
      )}
    </div>
  );
};

export default MediaDisplay;