import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const FloatingNav: React.FC = () => {
  const { t } = useTranslation();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });

  const base =
    'flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 backdrop-blur-md transition-colors hover:border-violet-400/50 hover:text-violet-200';

  return (
    <div className="fixed bottom-3 right-3 z-50 flex flex-col gap-2">
      <button onClick={scrollToTop} title={t('jumpToTop')} className={base}>
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <button onClick={scrollToBottom} title={t('jumpToBottom')} className={base}>
        <ArrowDown className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};
