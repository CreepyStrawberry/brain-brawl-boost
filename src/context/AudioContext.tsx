import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

type SoundType = 'click' | 'select' | 'correct' | 'incorrect' | 'roundComplete' | 'transition' | 'timerWarning';

interface AudioContextType {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  toggleMute: () => void;
  
  playSound: (sound: SoundType) => void;
  playClick: () => void;
  playSelect: () => void;
  playCorrect: () => void;
  playIncorrect: () => void;
  playRoundComplete: () => void;
  playTransition: () => void;
  playTimerWarning: () => void;
  
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  startMusic: () => void;
  stopMusic: () => void;
  
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Web Audio API sound generator
const createAudioContext = () => {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = createAudioContext();
  }
  return audioCtx;
};

// Resume audio context on user interaction (required by browsers)
const ensureAudioContext = async () => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  return ctx;
};

// Sound generators using Web Audio API
const playTone = async (frequency: number, duration: number, volume: number, type: OscillatorType = 'sine') => {
  const ctx = await ensureAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
};

const playClickSound = async (volume: number) => {
  const ctx = await ensureAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.08);
};

const playSelectSound = async (volume: number) => {
  const ctx = await ensureAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.setValueAtTime(400, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(volume * 0.2, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.15);
};

const playCorrectSound = async (volume: number) => {
  const ctx = await ensureAudioContext();
  
  // Play a pleasant ascending arpeggio
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  
  notes.forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';
    
    const startTime = ctx.currentTime + i * 0.1;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.25, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
  });
};

const playIncorrectSound = async (volume: number) => {
  const ctx = await ensureAudioContext();
  
  // Play a descending buzzer
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.setValueAtTime(300, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
  oscillator.type = 'sawtooth';
  
  gainNode.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.3);
};

const playRoundCompleteSound = async (volume: number) => {
  const ctx = await ensureAudioContext();
  
  // Fanfare-like sound
  const notes = [392, 523.25, 659.25, 783.99, 1046.5]; // G4, C5, E5, G5, C6
  
  notes.forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = freq;
    oscillator.type = 'sine';
    
    const startTime = ctx.currentTime + i * 0.08;
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.2, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.4);
  });
};

const playTransitionSound = async (volume: number) => {
  const ctx = await ensureAudioContext();
  
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.setValueAtTime(200, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
  oscillator.type = 'sine';
  
  gainNode.gain.setValueAtTime(volume * 0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.2);
};

const playTimerWarningSound = async (volume: number) => {
  await playTone(800, 0.15, volume, 'sine');
};

// Simple ambient music generator
class AmbientMusic {
  private ctx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private volume = 0.1;
  private intervalId: NodeJS.Timeout | null = null;

  async start(volume: number) {
    if (this.isPlaying) return;
    
    this.ctx = await ensureAudioContext();
    this.volume = volume;
    this.isPlaying = true;
    
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = volume * 0.15;
    this.gainNode.connect(this.ctx.destination);
    
    // Create ambient pad
    this.playAmbientChord();
    
    // Change chord every 4 seconds
    this.intervalId = setInterval(() => {
      if (this.isPlaying) {
        this.playAmbientChord();
      }
    }, 4000);
  }

  private playAmbientChord() {
    if (!this.ctx || !this.gainNode) return;
    
    // Stop previous oscillators
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    this.oscillators = [];
    
    const chords = [
      [261.63, 329.63, 392], // C major
      [293.66, 369.99, 440], // D major  
      [329.63, 415.30, 493.88], // E major
      [349.23, 440, 523.25], // F major
    ];
    
    const chord = chords[Math.floor(Math.random() * chords.length)];
    
    chord.forEach(freq => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();
      
      osc.connect(oscGain);
      oscGain.connect(this.gainNode!);
      
      osc.frequency.value = freq;
      osc.type = 'sine';
      
      const now = this.ctx!.currentTime;
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(1, now + 1);
      oscGain.gain.linearRampToValueAtTime(0, now + 3.5);
      
      osc.start(now);
      osc.stop(now + 4);
      
      this.oscillators.push(osc);
    });
  }

  stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    this.oscillators = [];
  }

  setVolume(volume: number) {
    this.volume = volume;
    if (this.gainNode) {
      this.gainNode.gain.value = volume * 0.15;
    }
  }
}

const ambientMusic = new AmbientMusic();

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [masterVolume, setMasterVolumeState] = useState(() => {
    const saved = localStorage.getItem('audio_masterVolume');
    return saved ? parseFloat(saved) : 0.7;
  });
  const [musicVolume, setMusicVolumeState] = useState(() => {
    const saved = localStorage.getItem('audio_musicVolume');
    return saved ? parseFloat(saved) : 0.5;
  });
  const [sfxVolume, setSfxVolumeState] = useState(() => {
    const saved = localStorage.getItem('audio_sfxVolume');
    return saved ? parseFloat(saved) : 0.7;
  });
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('audio_isMuted');
    return saved === 'true';
  });
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Persist settings
  useEffect(() => {
    localStorage.setItem('audio_masterVolume', masterVolume.toString());
  }, [masterVolume]);
  
  useEffect(() => {
    localStorage.setItem('audio_musicVolume', musicVolume.toString());
  }, [musicVolume]);
  
  useEffect(() => {
    localStorage.setItem('audio_sfxVolume', sfxVolume.toString());
  }, [sfxVolume]);
  
  useEffect(() => {
    localStorage.setItem('audio_isMuted', isMuted.toString());
  }, [isMuted]);
  
  // Update music volume when settings change
  useEffect(() => {
    if (isMusicPlaying) {
      ambientMusic.setVolume(isMuted ? 0 : masterVolume * musicVolume);
    }
  }, [masterVolume, musicVolume, isMuted, isMusicPlaying]);
  
  const getEffectiveVolume = useCallback(() => {
    return isMuted ? 0 : masterVolume * sfxVolume;
  }, [isMuted, masterVolume, sfxVolume]);
  
  const playSound = useCallback((sound: SoundType) => {
    const volume = getEffectiveVolume();
    if (volume === 0) return;
    
    switch (sound) {
      case 'click': playClickSound(volume); break;
      case 'select': playSelectSound(volume); break;
      case 'correct': playCorrectSound(volume); break;
      case 'incorrect': playIncorrectSound(volume); break;
      case 'roundComplete': playRoundCompleteSound(volume); break;
      case 'transition': playTransitionSound(volume); break;
      case 'timerWarning': playTimerWarningSound(volume); break;
    }
  }, [getEffectiveVolume]);
  
  const playClick = useCallback(() => playSound('click'), [playSound]);
  const playSelect = useCallback(() => playSound('select'), [playSound]);
  const playCorrect = useCallback(() => playSound('correct'), [playSound]);
  const playIncorrect = useCallback(() => playSound('incorrect'), [playSound]);
  const playRoundComplete = useCallback(() => playSound('roundComplete'), [playSound]);
  const playTransition = useCallback(() => playSound('transition'), [playSound]);
  const playTimerWarning = useCallback(() => playSound('timerWarning'), [playSound]);
  
  const startMusic = useCallback(async () => {
    if (!isMusicPlaying) {
      const volume = isMuted ? 0 : masterVolume * musicVolume;
      await ambientMusic.start(volume);
      setIsMusicPlaying(true);
    }
  }, [isMusicPlaying, isMuted, masterVolume, musicVolume]);
  
  const stopMusic = useCallback(() => {
    ambientMusic.stop();
    setIsMusicPlaying(false);
  }, []);
  
  const toggleMusic = useCallback(() => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [isMusicPlaying, startMusic, stopMusic]);
  
  const setMasterVolume = useCallback((v: number) => setMasterVolumeState(v), []);
  const setMusicVolume = useCallback((v: number) => setMusicVolumeState(v), []);
  const setSfxVolume = useCallback((v: number) => setSfxVolumeState(v), []);
  const toggleMute = useCallback(() => setIsMuted(prev => !prev), []);
  
  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);
  
  return (
    <AudioContext.Provider value={{
      masterVolume,
      musicVolume,
      sfxVolume,
      isMuted,
      setMasterVolume,
      setMusicVolume,
      setSfxVolume,
      toggleMute,
      playSound,
      playClick,
      playSelect,
      playCorrect,
      playIncorrect,
      playRoundComplete,
      playTransition,
      playTimerWarning,
      isMusicPlaying,
      toggleMusic,
      startMusic,
      stopMusic,
      isSettingsOpen,
      openSettings,
      closeSettings,
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
