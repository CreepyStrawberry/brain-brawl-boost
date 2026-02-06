import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

// Free sound effect URLs from Pixabay and other royalty-free sources
const SOUND_URLS = {
  click: 'https://cdn.pixabay.com/audio/2022/03/24/audio_8b4e27e5c5.mp3', // Soft click
  select: 'https://cdn.pixabay.com/audio/2022/03/15/audio_7ef78722a4.mp3', // Option select
  correct: 'https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3', // Success chime
  incorrect: 'https://cdn.pixabay.com/audio/2022/03/15/audio_6d0c02f79d.mp3', // Wrong buzzer
  roundComplete: 'https://cdn.pixabay.com/audio/2022/03/10/audio_cafa1e8d56.mp3', // Achievement
  transition: 'https://cdn.pixabay.com/audio/2022/03/24/audio_c1e5b5a6e3.mp3', // Whoosh
  timerWarning: 'https://cdn.pixabay.com/audio/2022/10/30/audio_5fe2bb8d70.mp3', // Timer beep
  hover: 'https://cdn.pixabay.com/audio/2022/03/24/audio_5c1b9c3b3b.mp3', // Subtle hover
};

// Background music - calm electronic/ambient
const MUSIC_URL = 'https://cdn.pixabay.com/audio/2022/05/16/audio_bdaacc3a22.mp3';

type SoundType = keyof typeof SOUND_URLS;

interface AudioContextType {
  // Volume controls
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  isMuted: boolean;
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  toggleMute: () => void;
  
  // Sound playback
  playSound: (sound: SoundType) => void;
  playClick: () => void;
  playSelect: () => void;
  playCorrect: () => void;
  playIncorrect: () => void;
  playRoundComplete: () => void;
  playTransition: () => void;
  playTimerWarning: () => void;
  
  // Music controls
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  startMusic: () => void;
  stopMusic: () => void;
  
  // Settings modal
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [masterVolume, setMasterVolume] = useState(() => {
    const saved = localStorage.getItem('audio_masterVolume');
    return saved ? parseFloat(saved) : 0.5;
  });
  const [musicVolume, setMusicVolume] = useState(() => {
    const saved = localStorage.getItem('audio_musicVolume');
    return saved ? parseFloat(saved) : 0.3;
  });
  const [sfxVolume, setSfxVolume] = useState(() => {
    const saved = localStorage.getItem('audio_sfxVolume');
    return saved ? parseFloat(saved) : 0.5;
  });
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('audio_isMuted');
    return saved === 'true';
  });
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const soundCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  
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
  
  // Initialize music element
  useEffect(() => {
    const music = new Audio(MUSIC_URL);
    music.loop = true;
    music.preload = 'auto';
    musicRef.current = music;
    
    return () => {
      music.pause();
      music.src = '';
    };
  }, []);
  
  // Update music volume
  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.volume = isMuted ? 0 : masterVolume * musicVolume;
    }
  }, [masterVolume, musicVolume, isMuted]);
  
  // Preload sounds
  useEffect(() => {
    Object.entries(SOUND_URLS).forEach(([key, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      soundCacheRef.current.set(key, audio);
    });
  }, []);
  
  const playSound = useCallback((sound: SoundType) => {
    if (isMuted) return;
    
    const effectiveVolume = masterVolume * sfxVolume;
    if (effectiveVolume === 0) return;
    
    // Create a new audio instance to allow overlapping sounds
    const audio = new Audio(SOUND_URLS[sound]);
    audio.volume = effectiveVolume;
    audio.play().catch(() => {
      // Ignore autoplay errors
    });
  }, [isMuted, masterVolume, sfxVolume]);
  
  const playClick = useCallback(() => playSound('click'), [playSound]);
  const playSelect = useCallback(() => playSound('select'), [playSound]);
  const playCorrect = useCallback(() => playSound('correct'), [playSound]);
  const playIncorrect = useCallback(() => playSound('incorrect'), [playSound]);
  const playRoundComplete = useCallback(() => playSound('roundComplete'), [playSound]);
  const playTransition = useCallback(() => playSound('transition'), [playSound]);
  const playTimerWarning = useCallback(() => playSound('timerWarning'), [playSound]);
  
  const startMusic = useCallback(() => {
    if (musicRef.current && !isMusicPlaying) {
      musicRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch(() => {
        // Autoplay blocked - will need user interaction
      });
    }
  }, [isMusicPlaying]);
  
  const stopMusic = useCallback(() => {
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
      setIsMusicPlaying(false);
    }
  }, []);
  
  const toggleMusic = useCallback(() => {
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [isMusicPlaying, startMusic, stopMusic]);
  
  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);
  
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
