import React from 'react';
import circuitBg from '@/assets/circuit-bg.jpg';
import BackgroundParticles from './BackgroundParticles';
import AudioControlButton from '@/components/audio/AudioControlButton';

interface SlideLayoutProps {
  children: React.ReactNode;
}

const SlideLayout: React.FC<SlideLayoutProps> = ({ children }) => {
  return (
    <div 
      className="slide-container"
      style={{ backgroundImage: `url(${circuitBg})` }}
    >
      <div className="slide-overlay" />
      <BackgroundParticles />
      <div className="scanline" />
      
      {/* Audio Controls - Top Right */}
      <div className="absolute right-4 top-4 z-50">
        <AudioControlButton />
      </div>
      
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  );
};

export default SlideLayout;
