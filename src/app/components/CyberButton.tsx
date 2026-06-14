import React from 'react';
import { motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'outline';
  fullWidth?: boolean;
}

// A single, calm accent system. Legacy variant names are kept so existing
// call sites don't break; they all resolve to the refined palette below.
const variants: Record<NonNullable<CyberButtonProps['variant']>, string> = {
  blue: 'text-white bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 shadow-lg shadow-violet-500/25',
  purple: 'text-white bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-400 hover:to-violet-400 shadow-lg shadow-fuchsia-500/25',
  green: 'text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25',
  orange: 'text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-orange-500/25',
  red: 'text-white bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 shadow-lg shadow-rose-500/25',
  outline: 'text-violet-200 bg-white/5 border border-white/15 hover:bg-white/10 hover:border-violet-400/50',
};

export const CyberButton: React.FC<CyberButtonProps> = ({
  children,
  variant = 'blue',
  fullWidth = false,
  className,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      className={twMerge(
        'relative inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-medium tracking-wide transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60',
        variants[variant],
        fullWidth ? 'w-full' : '',
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};
