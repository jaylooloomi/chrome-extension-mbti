import React from 'react';
import { motion } from 'motion/react';

interface LoadingBarProps {
  progress: number;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ progress }) => {
  return (
    <div className="w-full">
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
        {/* Soft moving sheen */}
        <div className="pointer-events-none absolute inset-0 animate-pulse bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)]" />
      </div>
      <div className="mt-2 text-right font-mono text-xs text-zinc-400">{Math.round(progress)}%</div>
    </div>
  );
};
