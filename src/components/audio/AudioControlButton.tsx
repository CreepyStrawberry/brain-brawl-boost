import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { Button } from '@/components/ui/button';
import { Settings, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioControlButtonProps {
  showSettings?: boolean;
  className?: string;
}

const AudioControlButton: React.FC<AudioControlButtonProps> = ({ 
  showSettings = true,
  className = '' 
}) => {
  const { isMuted, toggleMute, openSettings, playClick } = useAudio();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            toggleMute();
            if (isMuted) playClick();
          }}
          className={`border border-transparent hover:border-primary ${
            isMuted ? 'text-muted-foreground' : 'text-primary'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
      </motion.div>
      
      {showSettings && (
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              openSettings();
              playClick();
            }}
            className="border border-transparent text-muted-foreground hover:border-accent hover:text-accent"
            title="Audio Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default AudioControlButton;
