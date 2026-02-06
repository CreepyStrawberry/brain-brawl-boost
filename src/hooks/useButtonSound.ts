import { useCallback, useRef } from 'react';
import { useAudio } from '@/context/AudioContext';

/**
 * Hook that wraps a click handler with sound effects
 */
export const useButtonSound = () => {
  const { playClick, playSelect } = useAudio();
  const lastPlayedRef = useRef<number>(0);
  
  const withClickSound = useCallback(<T extends (...args: any[]) => any>(handler: T): T => {
    return ((...args: Parameters<T>) => {
      // Debounce sound to avoid rapid-fire
      const now = Date.now();
      if (now - lastPlayedRef.current > 50) {
        playClick();
        lastPlayedRef.current = now;
      }
      return handler(...args);
    }) as T;
  }, [playClick]);
  
  const withSelectSound = useCallback(<T extends (...args: any[]) => any>(handler: T): T => {
    return ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastPlayedRef.current > 50) {
        playSelect();
        lastPlayedRef.current = now;
      }
      return handler(...args);
    }) as T;
  }, [playSelect]);
  
  return { withClickSound, withSelectSound, playClick, playSelect };
};

export default useButtonSound;
