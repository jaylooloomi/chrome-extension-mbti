import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Share2, RotateCcw, Eye, EyeOff, Cpu } from 'lucide-react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import { MBTIResult } from '../utils/providers';
import { characterData } from '../data/characters';
import { PersonaRadar, RadarDatum } from './PersonaRadar';

const pct = (v?: string): number => {
  const n = parseFloat(String(v ?? '').replace('%', ''));
  return Number.isNaN(n) ? 0 : Math.max(0, Math.min(100, Math.round(n)));
};

interface ResultCardProps {
  result: MBTIResult;
  onRetest: () => void;
  t: (key: string) => string;
  source?: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onRetest, t, source }) => {
  const [showDetails, setShowDetails] = useState(true);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const screenshotTargetRef = React.useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const lang = (i18n.language.split('-')[0] || 'en') as 'en' | 'zh';
  const mbtiCode = (result.mbti || '').toUpperCase();
  const character = characterData[mbtiCode];

  const hasImage = Boolean(character && character.image);
  const displayTitle = character
    ? `${character.name[lang] || character.name.en} · ${result.title}`
    : result.title;

  const categories: Array<{ key: string; percent?: string; items?: string[] }> = [
    { key: 'food', percent: result.foodpercent, items: result.food },
    { key: 'clothing', percent: result.clothingpercent, items: result.clothing },
    { key: 'housing', percent: result.housingpercent, items: result.housing },
    { key: 'travel', percent: result.travelpercent, items: result.travel },
    { key: 'education', percent: result.educationpercent, items: result.education },
    { key: 'entertainment', percent: result.entertainmentpercent, items: result.entertainment },
    { key: 'money', percent: result.moneypercent, items: result.money },
    { key: 'sex', percent: result.sexpercent, items: result.sex },
    { key: 'pornstar', percent: result.pornstarpercent, items: result.pornstar },
  ];

  const radarData: RadarDatum[] = categories.map((c) => ({ label: t(c.key), value: pct(c.percent) }));

  const handleShare = async () => {
    if (!cardRef.current || !screenshotTargetRef.current) return;

    const nodeToCapture = cardRef.current;
    const nodeToStyle = screenshotTargetRef.current;
    const originalStyle = nodeToStyle.style.cssText;
    nodeToStyle.style.backgroundColor = '#0a0a0f';

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const dataUrl = await toPng(nodeToCapture, { cacheBust: true });
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      toast.success(t('copysuccess'));
    } catch (error) {
      console.error('Error capturing or copying image:', error);
      toast.error('Failed to copy image.');
    } finally {
      nodeToStyle.style.cssText = originalStyle;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
      ref={cardRef}
    >
      <div
        ref={screenshotTargetRef}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
      >
        <div className="relative z-10 flex flex-col items-center px-6 py-8 text-center">
          {/* Avatar */}
          <motion.div
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="relative mb-6"
          >
            <div className="flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 p-[3px]">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#0a0a0f]">
                {hasImage ? (
                  <img src={character!.image} alt="Character" className="h-full w-full object-cover" />
                ) : (
                  <span className="select-none text-5xl font-black text-zinc-700">?</span>
                )}
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-violet-400/40 bg-[#0a0a0f] px-4 py-1 font-mono text-sm font-bold tracking-widest text-violet-300 shadow-lg">
              {mbtiCode || '----'}
            </div>
          </motion.div>

          {/* Title */}
          <h2 className="font-display mt-4 max-w-[18rem] bg-gradient-to-r from-violet-300 via-white to-fuchsia-300 bg-clip-text text-2xl font-bold leading-tight text-transparent">
            {displayTitle}
          </h2>

          {/* Traits */}
          {result.traits?.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {result.traits.map((trait, i) => (
                <span
                  key={i}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-300"
                >
                  {trait}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="mt-6 w-full space-y-4 text-left">
            {character && (
              <p className="border-l-2 border-violet-400/60 pl-3 text-sm italic text-violet-200/90">
                “{character.description[lang] || character.description.en}”
              </p>
            )}
            <p className="text-sm leading-relaxed text-zinc-300">{result.description}</p>
          </div>

          {/* Persona radar — always visible hero */}
          <div className="mt-8 w-full">
            <p className="mb-1 text-center text-xs font-semibold uppercase tracking-widest text-violet-300/80">
              {t('favoriteThing')}
            </p>
            <PersonaRadar data={radarData} />
          </div>

          {/* Personality analysis — always visible (not affected by the keyword toggle) */}
          <div className="mt-6 w-full space-y-4 text-left">
            {result.yourself && (
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-violet-300/80">
                  {t('whoYouAre')}
                </p>
                <p className="text-sm leading-relaxed text-zinc-300">{result.yourself}</p>
              </div>
            )}
            {result.couple && (
              <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-violet-300/80">
                  {t('couple')}
                </p>
                <p className="text-sm leading-relaxed text-zinc-300">{result.couple}</p>
              </div>
            )}
          </div>

          {/* Keyword toggle — controls ONLY the keyword breakdown below */}
          <button
            onClick={() => setShowDetails((v) => !v)}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-zinc-300 transition-colors hover:border-violet-400/40 hover:text-violet-200"
          >
            {showDetails ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {showDetails ? t('hideKeyInfo') : t('unhideKeyInfo')}
          </button>

          {/* Keyword breakdown — toggleable */}
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 w-full space-y-3 text-left"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-300/80">
                {t('keywords')}
              </p>
              {categories
                .filter((c) => c.items && c.items.length > 0)
                .map((c) => (
                  <div key={c.key} className="flex flex-wrap items-center gap-1.5">
                    <span className="min-w-[2.75rem] text-sm font-semibold text-zinc-200">{t(c.key)}</span>
                    <span className="mr-1 font-mono text-[11px] text-violet-300">{pct(c.percent)}%</span>
                    {c.items!.map((item, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-300"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ))}
            </motion.div>
          )}

          {/* Provenance — which provider/model produced this result */}
          {source && (
            <p className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
              <Cpu className="h-3 w-3" /> {source}
            </p>
          )}

          {/* Actions */}
          <div className="mt-6 flex w-full gap-3">
            <button
              onClick={onRetest}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-zinc-200 transition-colors hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
              {t('retest')}
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-colors hover:from-violet-400 hover:to-indigo-400"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
