import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, X, ArrowRight, Heart } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDonate: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose, onDonate }) => {
  const { t } = useTranslation();
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-gray-900 border border-cyan-500/50 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden"
          >
            {/* Header / Tech decoration */}
            <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-cyan-500" />
            
            <div className="p-6 relative">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 shadow-inner">
                  <Heart className="w-8 h-8 text-pink-500 animate-pulse" fill="currentColor" />
                </div>
                
                <h3 className="text-xl font-bold text-white font-['Orbitron'] tracking-wider">
                  {t('systemMessage')}
                </h3>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {t('donationMessage')}
                </p>

                {/* Requested Footer Content */}
                <div className="w-full pt-4 mt-2 border-t border-gray-800">
                  <div className="flex flex-col items-center space-y-3">
                    <p className="text-cyan-400 font-mono text-sm">喜歡這個工具嗎？</p>
                    
                    <button 
                      id="donate-btn"
                      onClick={onDonate}
                      className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg text-white font-bold tracking-wide shadow-lg hover:shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      <Coffee className="w-5 h-5" />
                      <span>贊助一杯咖啡 ☕</span>
                      <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="mt-4 text-gray-500 hover:text-cyan-400 text-xs flex items-center gap-1 transition-colors"
                >
                  Skip & Start Analysis <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Tech Decoration Lines */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/30" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/30" />
          </motion.div>
          
        </div>
      )}
    </AnimatePresence>
  );
};
