import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const FloatingNav: React.FC = () => {
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <button
        onClick={scrollToTop}
        title={t('jumpToTop')}
        className="p-2 bg-gray-800/80 border border-cyan-500/50 rounded-full text-cyan-300 hover:bg-cyan-900/60 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all"
      >
        <ArrowUp className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={scrollToBottom}
        title={t('jumpToBottom')}
        className="p-2 bg-gray-800/80 border border-purple-500/50 rounded-full text-purple-300 hover:bg-purple-900/60 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all"
      >
        <ArrowDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
