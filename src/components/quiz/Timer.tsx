import React, { useEffect, useRef } from 'react';
import { useQuiz } from '@/context/QuizContext';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Timer: React.FC = () => {
  const { timeRemaining, timerRunning, startTimer, pauseTimer, resetTimer, setTimeRemaining } = useQuiz();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const beepPlayedRef = useRef(false);

  useEffect(() => {
    // Create beep audio
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playBeep = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    if (timeRemaining === 10 && timerRunning && !beepPlayedRef.current) {
      playBeep();
      beepPlayedRef.current = true;
    }

    if (timeRemaining > 10) {
      beepPlayedRef.current = false;
    }

    return () => {
      // Cleanup if needed
    };
  }, [timeRemaining, timerRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      pauseTimer();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeRemaining, setTimeRemaining, pauseTimer]);

  const isCritical = timeRemaining <= 10 && timeRemaining > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Timer display */}
      <div className={`relative mb-4 flex items-center justify-center ${isCritical ? 'timer-critical' : ''}`}>
        <div className="absolute inset-0 rounded-full border-4 border-primary/30" />
        <div 
          className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
          style={{ 
            transform: `rotate(${(1 - timeRemaining / 60) * 360}deg)`,
            transition: 'transform 1s linear'
          }}
        />
        <div className={`flex h-32 w-32 items-center justify-center rounded-full border-2 ${isCritical ? 'border-destructive bg-destructive/10' : 'border-primary bg-card/50'}`}>
          <span className={`font-display text-4xl font-bold ${isCritical ? 'text-destructive' : 'text-primary'}`}>
            {timeRemaining}
          </span>
        </div>
      </div>
      
      <span className="mb-4 font-display text-sm uppercase tracking-widest text-muted-foreground">
        Seconds
      </span>

      {/* Timer controls */}
      <div className="flex gap-2">
        {!timerRunning ? (
          <Button
            size="sm"
            onClick={startTimer}
            className="border border-success bg-success/20 text-success hover:bg-success hover:text-success-foreground"
          >
            <Play className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={pauseTimer}
            className="border border-warning bg-warning/20 text-warning hover:bg-warning hover:text-warning-foreground"
          >
            <Pause className="h-4 w-4" />
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => resetTimer(60)}
          className="border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Timer;
