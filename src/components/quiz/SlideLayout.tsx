import React from 'react';
import circuitBg from '@/assets/circuit-bg.jpg';
import BackgroundParticles from './BackgroundParticles';

interface SlideLayoutProps {
  children: React.ReactNode;
  showAudioControls?: boolean;
}

const SlideLayout: React.FC<SlideLayoutProps> = ({ children, showAudioControls = false }) => {
  return (
    <div 
      className="slide-container"
      style={{ backgroundImage: `url(${circuitBg})` }}
    >
      <div className="slide-overlay" />
      <BackgroundParticles />
      <div className="scanline" />
      
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  );
};

export default SlideLayout;
