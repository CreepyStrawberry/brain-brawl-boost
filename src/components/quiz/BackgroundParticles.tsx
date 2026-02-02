import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const BackgroundParticles: React.FC = () => {
  const particles = useMemo(() => {
    const items: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      items.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
      });
    }
    return items;
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, hsl(180 100% 50% / 0.05) 0%, transparent 50%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: 'hsl(180 100% 50% / 0.3)',
            boxShadow: '0 0 10px hsl(180 100% 50% / 0.5)',
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Moving grid lines */}
      <svg className="absolute inset-0 h-full w-full opacity-10">
        <motion.line
          x1="0%"
          y1="20%"
          x2="100%"
          y2="20%"
          stroke="hsl(180 100% 50%)"
          strokeWidth="1"
          animate={{ y1: ['20%', '25%', '20%'], y2: ['20%', '25%', '20%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.line
          x1="0%"
          y1="80%"
          x2="100%"
          y2="80%"
          stroke="hsl(180 100% 50%)"
          strokeWidth="1"
          animate={{ y1: ['80%', '75%', '80%'], y2: ['80%', '75%', '80%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.line
          x1="30%"
          y1="0%"
          x2="30%"
          y2="100%"
          stroke="hsl(150 85% 45%)"
          strokeWidth="1"
          animate={{ x1: ['30%', '35%', '30%'], x2: ['30%', '35%', '30%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.line
          x1="70%"
          y1="0%"
          x2="70%"
          y2="100%"
          stroke="hsl(150 85% 45%)"
          strokeWidth="1"
          animate={{ x1: ['70%', '65%', '70%'], x2: ['70%', '65%', '70%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
};

export default BackgroundParticles;
