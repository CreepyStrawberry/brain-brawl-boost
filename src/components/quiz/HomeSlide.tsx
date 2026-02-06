import React from 'react';
import { useQuiz } from '@/context/QuizContext';
import { useAudio } from '@/context/AudioContext';
import SlideLayout from './SlideLayout';
import { Button } from '@/components/ui/button';
import { Play, BookOpen, Trophy, Settings, Volume2, VolumeX, Music } from 'lucide-react';
import { motion } from 'framer-motion';

const HomeSlide: React.FC = () => {
  const { startQuiz, toggleEditMode, rounds, totalQuestions, totalPoints } = useQuiz();
  const { 
    playClick, 
    startMusic, 
    isMuted, 
    toggleMute, 
    openSettings,
    isMusicPlaying,
    toggleMusic
  } = useAudio();

  const handleStartQuiz = () => {
    playClick();
    startMusic();
    startQuiz();
  };

  const handleEditQuiz = () => {
    playClick();
    toggleEditMode();
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const,
        staggerChildren: 0.12 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94] as const 
      }
    },
  };

  return (
    <SlideLayout>
      <motion.div 
        className="flex flex-1 flex-col items-center justify-center px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top accent line */}
        <motion.div 
          className="mb-8 h-1 w-48 bg-gradient-to-r from-transparent via-primary to-transparent"
          variants={itemVariants}
        />
        
        {/* Main title */}
        <motion.h1 
          className="cyber-text-glow mb-4 text-center font-display text-5xl font-black uppercase tracking-wider text-primary md:text-7xl"
          variants={itemVariants}
        >
          IT Tech Quiz
        </motion.h1>
        
        <motion.p 
          className="mb-12 max-w-xl text-center font-body text-lg text-muted-foreground md:text-xl"
          variants={itemVariants}
        >
          Test your knowledge across networking, cybersecurity, and emerging technologies.
        </motion.p>

        {/* Quiz stats */}
        <motion.div 
          className="mb-12 flex items-center gap-8"
          variants={itemVariants}
        >
          <div className="flex flex-col items-center">
            <BookOpen className="mb-2 h-8 w-8 text-accent" />
            <span className="font-display text-3xl font-bold text-foreground">{rounds.length}</span>
            <span className="font-body text-sm text-muted-foreground">Rounds</span>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="flex flex-col items-center">
            <BookOpen className="mb-2 h-8 w-8 text-primary" />
            <span className="font-display text-3xl font-bold text-foreground">{totalQuestions}</span>
            <span className="font-body text-sm text-muted-foreground">Questions</span>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="flex flex-col items-center">
            <Trophy className="mb-2 h-8 w-8 text-warning" />
            <span className="font-display text-3xl font-bold text-foreground">{totalPoints}</span>
            <span className="font-body text-sm text-muted-foreground">Total Points</span>
          </div>
        </motion.div>

        {/* Audio Controls - Prominent on Home Page */}
        <motion.div 
          className="mb-8 flex items-center gap-3 rounded-lg border-2 border-primary/30 bg-card/60 px-6 py-4"
          variants={itemVariants}
        >
          <span className="font-display text-sm uppercase tracking-wider text-muted-foreground">Audio:</span>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleMute}
              className={`border-2 ${
                isMuted 
                  ? 'border-destructive/50 text-destructive hover:border-destructive' 
                  : 'border-success/50 text-success hover:border-success'
              }`}
            >
              {isMuted ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
              {isMuted ? 'Muted' : 'Sound On'}
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleMusic}
              className={`border-2 ${
                isMusicPlaying 
                  ? 'border-accent/50 text-accent hover:border-accent' 
                  : 'border-muted-foreground/30 text-muted-foreground hover:border-accent'
              }`}
            >
              <Music className="mr-2 h-4 w-4" />
              {isMusicPlaying ? 'Music On' : 'Music Off'}
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenSettings}
              className="text-muted-foreground hover:text-primary"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Action buttons */}
        <motion.div 
          className="flex flex-col gap-4 sm:flex-row"
          variants={itemVariants}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <Button
              onClick={handleStartQuiz}
              className="group relative overflow-hidden border-2 border-primary bg-primary/10 px-12 py-8 font-display text-xl uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Play className="h-6 w-6" />
                Start Quiz
              </span>
            </Button>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
          >
            <Button
              onClick={handleEditQuiz}
              variant="outline"
              className="border-2 border-muted-foreground/30 px-8 py-8 font-display text-lg uppercase tracking-wider text-muted-foreground hover:border-accent hover:text-accent"
            >
              <Settings className="mr-2 h-5 w-5" />
              Edit Quiz
            </Button>
          </motion.div>
        </motion.div>

        {/* Footer hint */}
        <motion.p 
          className="mt-12 text-center font-body text-sm text-muted-foreground/60"
          variants={itemVariants}
        >
          60 seconds per question • Instant feedback • Click buttons to hear sounds!
        </motion.p>
      </motion.div>
    </SlideLayout>
  );
};

export default HomeSlide;
