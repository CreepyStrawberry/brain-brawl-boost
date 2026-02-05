import React from 'react';
 import { useState, useEffect } from 'react';
import { MediaAttachment } from '@/types/quiz';
import { Image, Video, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
 import { getMediaFile } from '@/lib/mediaStorage';

interface MediaDisplayProps {
  attachments: MediaAttachment[];
  showRevealedOnly?: boolean;
}

const MediaDisplay: React.FC<MediaDisplayProps> = ({ attachments, showRevealedOnly = false }) => {
   const [resolvedUrls, setResolvedUrls] = useState<Record<string, string>>({});
   const [isLoading, setIsLoading] = useState(true);
 
   // Load media URLs from IndexedDB
   useEffect(() => {
     const loadUrls = async () => {
       setIsLoading(true);
       const urls: Record<string, string> = {};
       
       for (const attachment of attachments) {
         if (attachment.url) {
           if (attachment.url.startsWith('data:') || attachment.url.startsWith('http')) {
             urls[attachment.url] = attachment.url;
           } else {
             const media = await getMediaFile(attachment.url);
             if (media) {
               urls[attachment.url] = media.dataUrl;
             }
           }
         }
       }
       
       setResolvedUrls(urls);
       setIsLoading(false);
     };
     
     loadUrls();
   }, [attachments]);
 
  if (attachments.length === 0) return null;

  const primaryMedia = attachments[0];
  const revealedMedia = attachments[1];
  
  // If showRevealedOnly is true and we have a second image, show only that
  // Otherwise show the primary media
  const currentMedia = showRevealedOnly && revealedMedia ? revealedMedia : primaryMedia;
   const resolvedUrl = resolvedUrls[currentMedia.url] || currentMedia.url;
 
   if (isLoading) {
     return (
       <div className="cyber-border bg-card/40 p-4">
         <div className="flex h-40 items-center justify-center">
           <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
         </div>
       </div>
     );
   }

  const renderMedia = (media: MediaAttachment) => {
     const url = resolvedUrls[media.url] || media.url;
     
    switch (media.type) {
      case 'image':
        return (
          <motion.div 
            className="relative overflow-hidden rounded-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <img
               src={url}
              alt="Question media"
              className="h-auto max-h-80 w-full object-contain"
            />
          </motion.div>
        );
      
      case 'video':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <video
               src={url}
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
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
          >
             <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
               <Music className="h-8 w-8 text-accent" />
            </div>
            <audio
               src={url}
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
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={showRevealedOnly ? 'revealed' : 'initial'}
          initial={{ opacity: 0, x: showRevealedOnly ? 30 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: showRevealedOnly ? -30 : 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
        >
          {renderMedia(currentMedia)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MediaDisplay;