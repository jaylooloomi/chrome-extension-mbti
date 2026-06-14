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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-[#12121a] shadow-2xl"
          >
            <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500" />

            <div className="relative p-6">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-zinc-500 transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <Heart className="h-7 w-7 text-fuchsia-400" fill="currentColor" />
                </div>

                <h3 className="font-display text-lg font-bold tracking-wide text-white">
                  {t('systemMessage')}
                </h3>

                <p className="text-sm leading-relaxed text-zinc-400">{t('donationMessage')}</p>

                <div className="mt-2 w-full border-t border-white/10 pt-4">
                  <div className="flex flex-col items-center space-y-3">
                    <p className="font-mono text-sm text-violet-300">{t('likeThisTool')}</p>
                    <button
                      id="donate-btn"
                      onClick={onDonate}
                      className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/25 transition-transform hover:-translate-y-0.5"
                    >
                      <Coffee className="h-5 w-5" />
                      <span>{t('sponsorCoffee')}</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-violet-300"
                >
                  {t('skipAndStartAnalysis')} <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
