import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import {
  Sparkles, Server, Cpu, Shield, ExternalLink, KeyRound,
  Check, AlertTriangle, CloudDownload, Loader2,
} from 'lucide-react';
import { CyberButton } from './components/CyberButton';
import { LoadingBar } from './components/LoadingBar';
import { ResultCard } from './components/ResultCard';
import { FloatingNav } from './components/FloatingNav';
import { DonationModal } from './DonationModal';
import {
  analyzeMBTI, MBTIResult, PROVIDERS, getProvider, validateConfig,
  chromeAiAvailability, createChromeSession, ProviderId,
} from './utils/providers';
import { cleanBookmarkNode } from './utils/bookmarks';
import './i18n';

const iconImage = '/icons/icon_radar_128.png';
const bannerImage = '/images/characters.png';
const STORAGE = 'mbti.config.v2';

type ChromeStatus = 'checking' | 'available' | 'downloadable' | 'downloading' | 'unavailable' | 'unsupported';
interface Store {
  providerId: ProviderId;
  keys: Record<string, string>;
  urls: Record<string, string>;
  models: Record<string, string>;
}

function loadStore(): { store: Store; hadProvider: boolean } {
  const base: Store = { providerId: 'chrome-ai', keys: {}, urls: {}, models: {} };
  try {
    const raw = localStorage.getItem(STORAGE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { store: { ...base, ...parsed }, hadProvider: !!parsed.providerId };
    }
  } catch {
    /* ignore */
  }
  return { store: base, hadProvider: false };
}

function App() {
  const { t, i18n } = useTranslation();
  const initial = useRef(loadStore());
  const [store, setStore] = useState<Store>(initial.current.store);
  const [chromeStatus, setChromeStatus] = useState<ChromeStatus>('checking');
  const [downloadPct, setDownloadPct] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<MBTIResult | null>(null);
  const [resultSource, setResultSource] = useState('');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const lang = i18n.language.split('-')[0];

  const providerId = store.providerId;
  const preset = getProvider(providerId);
  const apiKey = store.keys[providerId] ?? '';
  const baseUrl = store.urls[providerId] ?? preset.baseUrl ?? '';
  const model = store.models[providerId] ?? preset.defaultModel ?? '';
  const chromeUsable = chromeStatus === 'available' || chromeStatus === 'downloadable' || chromeStatus === 'downloading';

  const setProviderId = (id: ProviderId) => setStore((s) => ({ ...s, providerId: id }));
  const setKey = (v: string) => setStore((s) => ({ ...s, keys: { ...s.keys, [providerId]: v } }));
  const setUrl = (v: string) => setStore((s) => ({ ...s, urls: { ...s.urls, [providerId]: v } }));
  const setModel = (v: string) => setStore((s) => ({ ...s, models: { ...s.models, [providerId]: v } }));

  // Persist settings.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(store));
    } catch {
      /* ignore */
    }
  }, [store]);

  // Detect Chrome built-in AI; if unsupported and the user never picked a provider, fall back to Gemini.
  useEffect(() => {
    let alive = true;
    chromeAiAvailability().then((status) => {
      if (!alive) return;
      setChromeStatus(status);
      if (!initial.current.hadProvider && initial.current.store.providerId === 'chrome-ai'
          && (status === 'unavailable' || status === 'unsupported')) {
        setStore((s) => (s.providerId === 'chrome-ai' ? { ...s, providerId: 'gemini' } : s));
      }
    });
    return () => { alive = false; };
  }, []);

  // DEV-only result preview.
  useEffect(() => {
    if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('demo')) {
      import('./data/demoResult').then((m) => setResult(m.demoResult));
    }
  }, []);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + Math.random() * 10));
    }, 200);
    return interval;
  };

  const getBookmarks = (): Promise<chrome.bookmarks.BookmarkTreeNode[]> =>
    new Promise((resolve, reject) => {
      if (typeof chrome !== 'undefined' && chrome.bookmarks) {
        chrome.bookmarks.getTree((nodes) => {
          if (chrome.runtime.lastError) reject(new Error(t('bookmarkApiError')));
          else resolve(nodes);
        });
      } else if (import.meta.env.DEV) {
        // Dev affordance: the bookmarks API only exists inside the packed extension,
        // so the dev server uses a small sample tree to exercise providers end-to-end.
        resolve([
          {
            id: '0', title: '', children: [
              {
                id: '1', title: 'Bookmarks Bar', children: [
                  { id: '2', title: 'GitHub' }, { id: '3', title: 'Hacker News' }, { id: '4', title: 'arXiv' },
                  { id: '5', title: 'Hugging Face' }, { id: '6', title: 'MDN Web Docs' }, { id: '7', title: 'Lobsters' },
                ],
              },
            ],
          },
        ] as unknown as chrome.bookmarks.BookmarkTreeNode[]);
      } else {
        reject(new Error(t('bookmarkApiError')));
      }
    });

  const handleAnalysis = async () => {
    const cfg = { providerId, baseUrl, apiKey, model };

    if (preset.kind === 'chrome') {
      if (!chromeUsable) {
        toast.error(t('chromeUnavailable'));
        return;
      }
    } else {
      const err = validateConfig(cfg);
      if (err) {
        toast.error(t(err));
        return;
      }
    }

    setResult(null);
    setDownloadPct(null);
    setIsLoading(true);

    // Start the on-device session NOW, inside the click gesture — Chrome requires
    // user activation to begin the first model download. Must happen before any await.
    const onDl = (loaded: number) => setDownloadPct(Math.round((loaded || 0) * 100));
    const chromeSession = preset.kind === 'chrome' ? createChromeSession(onDl) : undefined;
    chromeSession?.catch(() => {}); // error surfaces through analyzeMBTI below

    const progressInterval = simulateProgress();

    try {
      const bookmarks = await getBookmarks();
      const cleaned = bookmarks.map(cleanBookmarkNode);
      const analysis = await analyzeMBTI(cfg, cleaned, i18n.language, onDl, chromeSession);
      const sourceName =
        preset.kind === 'chrome'
          ? `${t('provider_chrome-ai')} · Gemini Nano`
          : `${t(`provider_${providerId}`)} · ${model || preset.defaultModel || ''}`;
      setProgress(100);
      setTimeout(() => {
        setResult(analysis);
        setResultSource(t('poweredBy', { source: sourceName }));
        setIsLoading(false);
        clearInterval(progressInterval);
      }, 600);
    } catch (err: any) {
      toast.error(err?.message || 'An error occurred');
      setIsLoading(false);
      clearInterval(progressInterval);
    }
  };

  const langButton = (code: string, label: string) => (
    <button
      onClick={() => i18n.changeLanguage(code)}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        lang === code ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-zinc-200'
      }`}
    >
      {label}
    </button>
  );

  const inputBase =
    'w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-9 pr-3 text-sm text-white placeholder-zinc-600 transition-all focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/30';

  return (
    <div className="relative min-h-screen w-full px-5 pb-10 pt-6 text-white">
      <Toaster richColors theme="dark" position="top-center" />
      <FloatingNav />

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#0a0a0f]">
        <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="absolute -right-16 top-1/2 h-72 w-72 rounded-full bg-fuchsia-600/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-indigo-600/15 blur-3xl" />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-xl border border-white/10 shadow-lg">
            <img src={iconImage} alt="Icon" className="h-full w-full object-cover" />
          </div>
          <h1 className="font-display text-lg font-bold leading-tight tracking-wide">{t('title')}</h1>
        </div>
        <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-0.5">
          {langButton('en', 'EN')}
          {langButton('zh', '中文')}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!result && (
          <motion.div key="intro" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <p className="mb-5 text-sm leading-relaxed text-zinc-400">{t('subtitle')}</p>

            {!isLoading && (
              <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/10">
                <img src={bannerImage} alt="MBTI personas" className="block h-auto w-full" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
              </div>
            )}

            {!isLoading && (
              <>
                {/* Provider */}
                <label className="mb-1.5 block text-xs font-medium text-zinc-400">{t('providerLabel')}</label>
                <div className="relative mb-4">
                  <select
                    value={providerId}
                    onChange={(e) => setProviderId(e.target.value as ProviderId)}
                    className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-3 pr-9 text-sm text-white transition-all focus:border-violet-500/60 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                  >
                    {PROVIDERS.map((p) => (
                      <option key={p.id} value={p.id} className="bg-[#12121a] text-white">
                        {t(`provider_${p.id}`)}
                      </option>
                    ))}
                  </select>
                  <Cpu className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                </div>

                {/* Chrome AI status */}
                {preset.kind === 'chrome' && (
                  <div className="mb-4 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs">
                    {chromeStatus === 'checking' && (
                      <><Loader2 className="mt-0.5 h-3.5 w-3.5 animate-spin text-zinc-400" /><span className="text-zinc-400">{t('chromeChecking')}</span></>
                    )}
                    {chromeStatus === 'available' && (
                      <><Check className="mt-0.5 h-3.5 w-3.5 text-emerald-400" /><span className="text-zinc-300">{t('chromeReady')}</span></>
                    )}
                    {(chromeStatus === 'downloadable' || chromeStatus === 'downloading') && (
                      <><CloudDownload className="mt-0.5 h-3.5 w-3.5 text-violet-300" /><span className="text-zinc-300">{t('chromeDownload')}</span></>
                    )}
                    {(chromeStatus === 'unavailable' || chromeStatus === 'unsupported') && (
                      <><AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-400" /><span className="text-zinc-300">{t('chromeUnavailable')}</span></>
                    )}
                  </div>
                )}

                {/* API key */}
                {preset.needsKey && (
                  <>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">{t('apiKeyLabel')}</label>
                    <div className="group relative mb-4">
                      <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-violet-400" />
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setKey(e.target.value)}
                        title={t('ollamaTooltip')}
                        className={inputBase + ' pr-28'}
                        placeholder={t('keyPlaceholder')}
                      />
                      {preset.keyUrl && (
                        <a
                          href={preset.keyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 text-xs font-medium text-violet-300 transition-colors hover:text-violet-200"
                        >
                          {t('getKey')} <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </>
                )}

                {/* Base URL (Ollama / custom) */}
                {preset.editableUrl && (
                  <>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">{t('baseUrlLabel')}</label>
                    <div className="group relative mb-4">
                      <Server className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-violet-400" />
                      <input
                        value={baseUrl}
                        onChange={(e) => setUrl(e.target.value)}
                        className={inputBase}
                        placeholder={preset.baseUrl || 'http://localhost:11434/v1'}
                      />
                    </div>
                  </>
                )}

                {/* Model */}
                {preset.kind === 'openai' && (
                  <>
                    <label className="mb-1.5 block text-xs font-medium text-zinc-400">{t('modelLabel')}</label>
                    <div className="group relative mb-6">
                      <Cpu className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-violet-400" />
                      <input
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className={inputBase}
                        placeholder={preset.defaultModel || 'model name'}
                      />
                    </div>
                  </>
                )}

                <CyberButton onClick={handleAnalysis} variant="blue" fullWidth className="py-3.5 text-base">
                  <Sparkles className="h-5 w-5" /> {t('aiButton')}
                </CyberButton>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-4 py-10">
          <LoadingBar progress={progress} />
          <p className="animate-pulse text-center font-mono text-xs text-violet-300">
            {downloadPct !== null
              ? `${t('chromeDownloading')} ${downloadPct}%`
              : progress < 50
              ? t('downloading')
              : t('analyzing')}
          </p>
        </div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="w-full"
          >
            <ResultCard result={result} onRetest={() => setResult(null)} t={t} source={resultSource} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 flex items-start gap-2.5 border-t border-white/10 pt-5 text-xs text-zinc-500">
        <Shield className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
        <p className="leading-relaxed">{t('privacy')}</p>
      </div>

      <div className="mt-4 text-center font-mono text-[10px] text-zinc-600">
        {t('footerAuth')}
        <button onClick={() => setShowDonationModal(true)} className="ml-2 transition-colors hover:text-violet-300">
          {t('coffeeicon')}
        </button>
      </div>

      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        onDonate={() => {
          window.open('https://buymeacoffee.com/arthurwang', '_blank');
          setShowDonationModal(false);
        }}
      />
    </div>
  );
}

export default App;
