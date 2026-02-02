import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
  type: 'square' | 'circle' | 'triangle';
}

const Confetti: React.FC<{ show: boolean }> = ({ show }) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (show) {
      const colors = [
        'hsl(180, 100%, 50%)',
        'hsl(150, 85%, 45%)',
        'hsl(45, 100%, 55%)',
        'hsl(200, 100%, 60%)',
        'hsl(280, 80%, 60%)',
        'hsl(320, 80%, 60%)',
      ];
      
      const types: ('square' | 'circle' | 'triangle')[] = ['square', 'circle', 'triangle'];
      
      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < 60; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          y: -10 - Math.random() * 20,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 6,
          delay: Math.random() * 0.5,
          type: types[Math.floor(Math.random() * types.length)],
        });
      }
      setPieces(newPieces);
    } else {
      setPieces([]);
    }
  }, [show]);

  const getShape = (type: string, color: string, size: number) => {
    switch (type) {
      case 'circle':
        return { borderRadius: '50%', backgroundColor: color };
      case 'triangle':
        return {
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid ${color}`,
        };
      default:
        return { backgroundColor: color };
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute"
              style={{
                left: `${piece.x}%`,
                width: piece.type === 'triangle' ? 0 : piece.size,
                height: piece.type === 'triangle' ? 0 : piece.size,
                ...getShape(piece.type, piece.color, piece.size),
                boxShadow: piece.type !== 'triangle' ? `0 0 10px ${piece.color}` : 'none',
              }}
              initial={{ 
                top: `${piece.y}%`, 
                rotate: piece.rotation,
                opacity: 1,
              }}
              animate={{ 
                top: '110%',
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 2.5 + Math.random(),
                delay: piece.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default Confetti;
