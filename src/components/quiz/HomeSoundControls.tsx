import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Music, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const HomeSoundControls: React.FC = () => {
  const { 
    isMuted, 
    toggleMute, 
    isMusicPlaying,
    toggleMusic,
    openSettings,
    playClick
  } = useAudio();

  const handleToggleMute = () => {
    toggleMute();
    if (isMuted) {
      // Will be unmuted, play a click to confirm
      setTimeout(() => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }, 50);
    }
  };

  const handleToggleMusic = () => {
    playClick();
    toggleMusic();
  };

  const handleOpenSettings = () => {
    playClick();
    openSettings();
  };

  return (
    <div className="absolute right-4 top-4 z-50 flex items-center gap-2">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleMute}
          className={`border-2 ${
            isMuted 
              ? 'border-destructive/50 bg-card/60 text-destructive hover:border-destructive' 
              : 'border-success/50 bg-card/60 text-success hover:border-success'
          }`}
          title={isMuted ? 'Unmute SFX' : 'Mute SFX'}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          <span className="ml-1.5 hidden sm:inline text-xs">SFX {isMuted ? 'OFF' : 'ON'}</span>
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleMusic}
          className={`border-2 ${
            isMusicPlaying 
              ? 'border-accent/50 bg-card/60 text-accent hover:border-accent' 
              : 'border-muted-foreground/30 bg-card/60 text-muted-foreground hover:border-accent'
          }`}
          title={isMusicPlaying ? 'Turn Music Off' : 'Turn Music On'}
        >
          <Music className="h-4 w-4" />
          <span className="ml-1.5 hidden sm:inline text-xs">Music {isMusicPlaying ? 'ON' : 'OFF'}</span>
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpenSettings}
          className="bg-card/60 text-muted-foreground hover:text-primary"
          title="Audio Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default HomeSoundControls;
