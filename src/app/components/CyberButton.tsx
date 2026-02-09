import React from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  fullWidth?: boolean;
}

const variants = {
  blue: "bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)] border-blue-400",
  green: "bg-green-600 hover:bg-green-500 shadow-[0_0_15px_rgba(22,163,74,0.5)] border-green-400",
  orange: "bg-orange-600 hover:bg-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.5)] border-orange-400",
  purple: "bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.5)] border-purple-400",
  red: "bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.5)] border-red-400",
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={twMerge(
        "relative py-3 px-6 rounded-md font-bold text-white transition-all duration-300 border-b-4 active:border-b-0 active:translate-y-1 uppercase tracking-wider",
        variants[variant],
        fullWidth ? "w-full" : "",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {children}
      </div>
    </motion.button>
  );
};
