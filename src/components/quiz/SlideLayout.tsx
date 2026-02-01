import React from 'react';
import circuitBg from '@/assets/circuit-bg.jpg';

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
      <div className="scanline" />
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  );
};

export default SlideLayout;
