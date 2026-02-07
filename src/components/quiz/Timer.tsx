import React, { useEffect, useRef } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Timer: React.FC = () => {
  const { 
    timeRemaining, 
    timerRunning, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    setTimeRemaining, 
    currentQuestion,
    handleTimeout,
    answerRevealed
  } = useQuiz();
  
  const { isMuted, masterVolume, sfxVolume } = useAudio();
  
  const beepPlayedRef = useRef(false);
  const hasAutoStarted = useRef(false);
  const tickingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const questionTimeLimit = currentQuestion?.timeLimit || 60;

  // Auto-start timer on mount and reset when question changes
  useEffect(() => {
    hasAutoStarted.current = true;
    startTimer();
    return () => {
      hasAutoStarted.current = false;
    };
  }, [currentQuestion?.id, startTimer]);

  // Ticking sound effect for last 10 seconds
  useEffect(() => {
    const playTick = (intensity: number) => {
      if (isMuted) return;
      
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Higher pitch and louder as time decreases
      const baseFreq = 600 + (10 - intensity) * 50;
      oscillator.frequency.value = baseFreq;
      oscillator.type = 'sine';
      
      const volume = masterVolume * sfxVolume * (0.1 + (10 - intensity) * 0.03);
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.08);
    };
    
    if (timerRunning && timeRemaining <= 10 && timeRemaining > 0 && !answerRevealed) {
      playTick(timeRemaining);
    }
    
    return () => {
      if (tickingIntervalRef.current) {
        clearInterval(tickingIntervalRef.current);
        tickingIntervalRef.current = null;
      }
    };
  }, [timeRemaining, timerRunning, isMuted, masterVolume, sfxVolume, answerRevealed]);

  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && timerRunning && !answerRevealed) {
      // Time ran out - trigger timeout
      handleTimeout();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeRemaining, setTimeRemaining, handleTimeout, answerRevealed]);

  const isCritical = timeRemaining <= 10 && timeRemaining > 0;
  const isUrgent = timeRemaining <= 5 && timeRemaining > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Timer display */}
      <motion.div 
        className={`relative mb-4 flex items-center justify-center ${isCritical ? 'timer-critical' : ''}`}
        animate={isUrgent ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{
          duration: 0.5,
          repeat: isUrgent ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-primary/30" />
        <motion.div 
          className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
          style={{ 
            transform: `rotate(${(1 - timeRemaining / questionTimeLimit) * 360}deg)`,
          }}
          transition={{ duration: 1, ease: 'linear' }}
        />
        <motion.div 
          className={`flex h-32 w-32 items-center justify-center rounded-full border-2 ${isCritical ? 'border-destructive bg-destructive/10' : 'border-primary bg-card/50'}`}
          animate={isUrgent ? {
            boxShadow: [
              '0 0 0 0 hsl(0 85% 55% / 0)',
              '0 0 30px 10px hsl(0 85% 55% / 0.4)',
              '0 0 0 0 hsl(0 85% 55% / 0)',
            ],
          } : {}}
          transition={{
            duration: 1,
            repeat: isUrgent ? Infinity : 0,
          }}
        >
          <motion.span 
            className={`font-display text-4xl font-bold ${isCritical ? 'text-destructive' : 'text-primary'}`}
            key={timeRemaining}
            initial={{ scale: 1.2, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {timeRemaining}
          </motion.span>
        </motion.div>
      </motion.div>
      
      <span className="mb-4 font-display text-sm uppercase tracking-widest text-muted-foreground">
        Seconds
      </span>

      {/* Timer controls */}
      <div className="flex gap-2">
        {!timerRunning ? (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              onClick={startTimer}
              className="border border-success bg-success/20 text-success hover:bg-success hover:text-success-foreground"
            >
              <Play className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              onClick={pauseTimer}
              className="border border-warning bg-warning/20 text-warning hover:bg-warning hover:text-warning-foreground"
            >
              <Pause className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => resetTimer(questionTimeLimit)}
            className="border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Timer;
