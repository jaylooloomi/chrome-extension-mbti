import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster, toast } from 'sonner';
import { Bot, Key, ExternalLink, Globe, Shield, Download } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
import { Label } from './components/ui/label';
import { CyberButton } from './components/CyberButton';
import { LoadingBar } from './components/LoadingBar';
import { ResultCard } from './components/ResultCard';
import { analyzeMBTI, MBTIResult } from './utils/gemini';
import { downloadBookmarks, cleanBookmarkNode, downloadBookmarksAsText, formatBookmarksToText } from './utils/bookmarks';
import { FloatingNav } from './components/FloatingNav';
import './i18n';

// Assets
// Replaced Figma assets with local/web assets to fix build errors
const iconImage = "/icons/icon-Photoroom.png"; 
// Replaced banner with high quality Unsplash image to solve transparency/quality issues
const bannerImage = "/images/characters.png";
const bgImage = "/images/photo-1535868463750-c78d9543614f.avif"; // Cyberpunk abstract bg

function App() {
  const { t, i18n } = useTranslation();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<MBTIResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  if (result && resultRef.current) {
    resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
     setTimeout(() => {
      window.scrollBy(0, -30); // 向上滾動 10 像素以作為偏移
    }, 500); // 5
  }
}, [result]);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 200);
    return interval;
  };

  const getBookmarks = (t: (key: string) => string): Promise<chrome.bookmarks.BookmarkTreeNode[]> => {
    return new Promise((resolve, reject) => {
      if (chrome && chrome.bookmarks) {
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
          if (chrome.runtime.lastError) {
            console.error("Error getting bookmarks:", chrome.runtime.lastError);
            reject(new Error(t('bookmarkApiError')));
          } else {
            resolve(bookmarkTreeNodes);
          }
        });
      } else {
        console.error("chrome.bookmarks API is not available.");
        reject(new Error(t('bookmarkApiError')));
      }
    });
  };

  const handleDownloadBookmarks = async () => {
    try {
      const bookmarks = await getBookmarks(t);
      downloadBookmarks(bookmarks);
    } catch (err: any) {
      toast.error(err.message || "An error occurred while fetching bookmarks.");
    }
  };

  const handleAnalysis = async () => {
    if (!apiKey) {
      toast.error(t('Please enter a valid Gemini API Key'));
      return;
    }
    setIsLoading(true);
    setResult(null);
    
    const progressInterval = simulateProgress();

    try {
      const bookmarks = await getBookmarks(t);
      const cleanedBookmarks = bookmarks.map(cleanBookmarkNode);

      // Create text version for download
      //const bookmarksText = formatBookmarksToText(bookmarks);
      
      // Trigger the download of the text file
      //const filename = downloadBookmarksAsText(bookmarksText);
      //console.log(`Bookmarks for analysis saved to: ${filename} (in your Downloads folder)`);
      
      // Pass the cleaned JSON object to the analysis function
      const analysisResult = await analyzeMBTI(apiKey, cleanedBookmarks, i18n.language);
      
      setProgress(100);
      setTimeout(() => {
        setResult(analysisResult);
        setIsLoading(false);
        clearInterval(progressInterval);
      }, 800);

    } catch (err: any) {
      toast.error(err.message || "An error occurred");
      setIsLoading(false);
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200 pt-8 pb-12 px-4 flex flex-col items-center relative overflow-x-auto">
      <Toaster richColors theme="dark" />
      <FloatingNav />
      {/* Background Image - Reduced overlay opacity to make background more visible (Bug 1 Fix) */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="Cyberpunk Background" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
      </div>

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-2xl bg-white-900/80 border border-white-700/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="flex justify-end items-center mb-4">
          <CyberButton onClick={handleDownloadBookmarks} variant="outline" className="text-sm hidden">
            <Download className="w-4 h-4" />
            {t('downloadBookmarks')}
          </CyberButton>

          <RadioGroup
            value={i18n.language.split('-')[0]}
            onValueChange={handleLanguageChange}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="r-en" className="bg-gray-800 border-gray-600" />
              <Label htmlFor="r-en">English</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="zh" id="r-zh" className="bg-gray-800 border-gray-600" />
              <Label htmlFor="r-zh">中文</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg border border-white/10">
              <img src={iconImage} alt="Icon" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide drop-shadow-md whitespace-nowrap">
              {t('title')}
            </h1>
          </div>
        </div>

        {/* API Key Section */}
        <div className="mb-6 space-y-2">
          <label className="block text-sm font-medium text-gray-300 ml-1">
            {t('apiKeyLabel')}
          </label>
          <div className="relative group" onClick={() => toast.success(t('tooltipApiKey'))}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="block w-full pl-10 pr-32 py-3 border border-gray-600 rounded-xl leading-5 bg-gray-800/80 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 sm:text-sm transition-all shadow-inner"
              placeholder="AIzaSy..."
            />
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {t('getKey')} <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>

        {/* Banner Image */}
        {!result && (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 rounded-xl overflow-hidden shadow-lg border border-white/5 relative"
            >
                <img src={bannerImage} alt="Cyberpunk Team" className="w-full h-auto object-cover max-h-64" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
            </motion.div>
        )}

        {/* Main Actions */}
        {!result && !isLoading && (
          <div className="space-y-4">
            <CyberButton onClick={handleAnalysis} variant="blue" fullWidth className="py-4 text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]">
              <Bot className="w-6 h-6" /> {t('aiButton')}
            </CyberButton>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 flex flex-col items-center justify-center space-y-6">
            <div className="w-full max-w-md space-y-2">
              <LoadingBar progress={progress} />
              <p className="text-center text-cyan-400 font-mono text-sm animate-pulse">
                {progress < 50 ? t('analyzing') : t('downloading')}
              </p>
            </div>
          </div>
        )}

        {/* Result State */}
        <AnimatePresence>
          {result && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-10 w-full"
            >
              <ResultCard 
                result={result} 
                onRetest={() => setResult(null)}
                t={t}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Privacy Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700/50 flex items-start gap-3 text-xs text-gray-400">
          <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{t('privacy')}</p>
        </div>
        
        <div className="mt-4 text-center text-gray-500 text-[10px] font-mono opacity-60 hover:opacity-100 transition-opacity">
           {t('footerAuth')}
        </div>
      </motion.div>
    </div>
  );
}

export default App;
