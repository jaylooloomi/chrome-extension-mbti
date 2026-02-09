import React from 'react';
import { motion } from 'motion/react';

interface LoadingBarProps {
  progress: number;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ progress }) => {
  return (
    <div className="w-full h-6 bg-gray-900 rounded-full border border-gray-700 overflow-hidden relative">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] animate-pulse z-10 pointer-events-none"></div>
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5 }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-white font-bold tracking-widest mix-blend-difference">
        LOADING {Math.round(progress)}%
      </div>
    </div>
  );
};
