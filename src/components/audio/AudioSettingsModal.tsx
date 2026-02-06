import React from 'react';
import { useAudio } from '@/context/AudioContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AudioSettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    closeSettings,
    masterVolume,
    musicVolume,
    sfxVolume,
    isMuted,
    isMusicPlaying,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    toggleMute,
    toggleMusic,
    playClick,
  } = useAudio();

  const handleSliderChange = (setter: (value: number) => void) => (values: number[]) => {
    setter(values[0]);
  };

  return (
    <Dialog open={isSettingsOpen} onOpenChange={closeSettings}>
      <DialogContent className="border-2 border-primary bg-card/95 backdrop-blur-sm sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 font-display text-xl uppercase tracking-wider text-primary">
            <Volume2 className="h-6 w-6" />
            Audio Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Controls */}
          <div className="flex items-center justify-between gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => {
                  toggleMute();
                  if (!isMuted) playClick();
                }}
                className={`border-2 px-6 py-6 font-display uppercase ${
                  isMuted 
                    ? 'border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground' 
                    : 'border-success text-success hover:bg-success hover:text-success-foreground'
                }`}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="mr-2 h-5 w-5" />
                    Muted
                  </>
                ) : (
                  <>
                    <Volume2 className="mr-2 h-5 w-5" />
                    Sound On
                  </>
                )}
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => {
                  toggleMusic();
                  playClick();
                }}
                className={`border-2 px-6 py-6 font-display uppercase ${
                  isMusicPlaying 
                    ? 'border-accent text-accent hover:bg-accent hover:text-accent-foreground' 
                    : 'border-muted-foreground text-muted-foreground hover:border-accent hover:text-accent'
                }`}
              >
                <Music className="mr-2 h-5 w-5" />
                {isMusicPlaying ? 'Music On' : 'Music Off'}
              </Button>
            </motion.div>
          </div>

          {/* Master Volume */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 font-display text-sm uppercase tracking-wider text-foreground">
                <Volume2 className="h-4 w-4 text-primary" />
                Master Volume
              </label>
              <span className="font-display text-lg font-bold text-primary">
                {Math.round(masterVolume * 100)}%
              </span>
            </div>
            <Slider
              value={[masterVolume]}
              max={1}
              step={0.05}
              onValueChange={handleSliderChange(setMasterVolume)}
              className="w-full"
            />
          </div>

          {/* Music Volume */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 font-display text-sm uppercase tracking-wider text-foreground">
                <Music className="h-4 w-4 text-accent" />
                Background Music
              </label>
              <span className="font-display text-lg font-bold text-accent">
                {Math.round(musicVolume * 100)}%
              </span>
            </div>
            <Slider
              value={[musicVolume]}
              max={1}
              step={0.05}
              onValueChange={handleSliderChange(setMusicVolume)}
              className="w-full"
            />
          </div>

          {/* SFX Volume */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 font-display text-sm uppercase tracking-wider text-foreground">
                <Sparkles className="h-4 w-4 text-success" />
                Sound Effects
              </label>
              <span className="font-display text-lg font-bold text-success">
                {Math.round(sfxVolume * 100)}%
              </span>
            </div>
            <Slider
              value={[sfxVolume]}
              max={1}
              step={0.05}
              onValueChange={handleSliderChange(setSfxVolume)}
              className="w-full"
            />
          </div>

          {/* Test Sound Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={playClick}
              variant="outline"
              className="w-full border-2 border-primary/50 py-6 font-display uppercase tracking-wider text-primary hover:border-primary hover:bg-primary/10"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Test Sound
            </Button>
          </motion.div>
        </div>

        {/* Info */}
        <p className="text-center font-body text-xs text-muted-foreground">
          Settings are saved automatically
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default AudioSettingsModal;
