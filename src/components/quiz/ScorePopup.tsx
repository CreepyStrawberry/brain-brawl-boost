import React from 'react';

interface ScorePopupProps {
  points: number;
  show: boolean;
}

const ScorePopup: React.FC<ScorePopupProps> = ({ points, show }) => {
  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      <div className="animate-score-pop flex flex-col items-center">
        <span className="cyber-text-success font-display text-8xl font-black text-success md:text-9xl">
          +{points}
        </span>
        <span className="font-display text-3xl uppercase tracking-widest text-success">
          Points
        </span>
      </div>
    </div>
  );
};

export default ScorePopup;
