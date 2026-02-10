import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Send } from 'lucide-react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import { MBTIResult } from '../utils/gemini';
import { characterData } from '../data/characters';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

interface ResultCardProps {
  result: MBTIResult;
  onRetest: () => void;
  t: (key: string) => string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onRetest, t }) => {
  const [keyInfoVisibility, setKeyInfoVisibility] = useState('unhide');
  const cardRef = React.useRef<HTMLDivElement>(null);
  const screenshotTargetRef = React.useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const lang = (i18n.language.split('-')[0] || 'en') as 'en' | 'zh';
  const mbtiCode = result.mbti.toUpperCase();
  const character = characterData[mbtiCode];
  
  // Logic for image: Use matched character image, or 'X' placeholder if none
  const hasImage = character && character.image;
  
  // Logic for title: Standard Name / AI Title
  const displayTitle = character 
    ? `${character.name[lang] || character.name.en} / ${result.title}`
    : result.title;

  // Logic for description: Standard Desc + AI Desc
  // We use the character description from our data if available, then the AI one.
  const descriptionSection = (
    <div className="space-y-6">
      {character && (
         <p className="text-cyan-200/90 font-medium text-lg italic border-l-4 border-cyan-500 pl-4">
            "{character.description[lang] || character.description.en}"
         </p>
      )}
      <p className="text-gray-300/90 leading-loose font-light text-justify text-base">
        {result.description}
      </p>
    </div>
  );

  const renderCategorySection = (category: string, percent: string, items: string[]) => {
    // If there are no items for a category, don't render anything for it.
    if (!items || items.length === 0) return null;

    return (
      <div key={category} className="mb-4">
        <h3 className="mb-3 text-lg font-bold text-white tracking-wide drop-shadow-md whitespace-nowrap">
          {t(category)}
          {percent ? `(${String(percent).replace('%', '')}%)` : ''}:
        </h3>
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span key={i} className="bg-gray-800/81 text-gray-200 text-xs px-3 py-1 rounded-full shadow-sm hover:text-cyan-300 transition-colors cursor-default">
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const descriptionSectionAdult1 = (
    <div className="w-full space-y-6 text-left">
      <p className="text-cyan-200/92 font-medium text-lg italic border-l-4 border-cyan-500 pl-4">
        "{t('favoriteThing')}"
      </p>
      <div>
        {renderCategorySection('food', result.foodpercent, result.food)}
        {renderCategorySection('clothing', result.clothingpercent, result.clothing)}
        {renderCategorySection('housing', result.housingpercent, result.housing)}
        {renderCategorySection('travel', result.travelpercent, result.travel)}
        {renderCategorySection('education', result.educationpercent, result.education)}
        {renderCategorySection('entertainment', result.entertainmentpercent, result.entertainment)}
        {renderCategorySection('money', result.moneypercent, result.money)}
        {renderCategorySection('sex', result.sexpercent, result.sex)}
        {renderCategorySection('pornstar', result.pornstarpercent, result.pornstar)}
      </div>
    </div>
  );

  const descriptionSectionAdult2 = (
    <div className="space-y-8">
      {character && (
        <p className="text-cyan-200/92 font-medium text-lg italic border-l-4 border-cyan-500 pl-4">
        "{t('whoYouAre')}"
      </p>
      )}
      <p className="text-gray-300/94 leading-loose font-light text-justify text-base">
        {result.yourself}
      </p>
    </div>
  );

  const descriptionSectionAdult3 = (
    <div className="space-y-10">
      {character && (
         <p className="text-cyan-200/92 font-medium text-lg italic border-l-4 border-cyan-500 pl-4">
        "{t('couple')}"
      </p>
      )}
      <p className="text-gray-300/96 leading-loose font-light text-justify text-base">
        {result.couple}
      </p>
    </div>
  );

  const handleShare = async () => {
    if (!cardRef.current || !screenshotTargetRef.current) {
      return;
    }

    const nodeToCapture = cardRef.current;
    const nodeToStyle = screenshotTargetRef.current;
    const originalStyle = nodeToStyle.style.cssText;
    
    // Temporarily apply black background for screenshot, keeping the grid
    nodeToStyle.style.backgroundColor = 'black';

    try {
      // Delay slightly to ensure styles are applied
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(nodeToCapture, { cacheBust: true });
      const blob = await (await fetch(dataUrl)).blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      toast.success(t('copysuccess'));

    } catch (error) {
      console.error('Error capturing or copying image:', error);
      toast.error('Failed to copy image.');
    } finally {
      // Restore original styles
      nodeToStyle.style.cssText = originalStyle;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full"
      ref={cardRef}
    >
      <div 
        ref={screenshotTargetRef}
        className="relative overflow-hidden rounded-2xl bg-gray-900/40 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,255,255,0.1)]"
      >
        {/* Background Grid Effect - Subtle */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="p-8 md:p-10 flex flex-col items-center text-center relative z-10">
          
          {/* Avatar Section */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 relative"
          >
            <div className="w-56 h-56 rounded-full p-1 bg-gradient-to-b from-cyan-400 to-purple-600 shadow-[0_0_40px_rgba(6,182,212,0.4)] flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-black relative bg-black flex items-center justify-center">
                    {hasImage ? (
                        <>
                            <img 
                                src={character.image} 
                                alt="Character" 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/30 to-transparent mix-blend-overlay"></div>
                        </>
                    ) : (
                        <span className="text-6xl font-black text-gray-700 select-none">X</span>
                    )}
                </div>
            </div>

            {/* Type Label - ENLARGED per request & Fixed Layout */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-black border-2 border-cyan-400 text-cyan-400 px-6 py-2 rounded-md font-mono text-xl font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)] tracking-widest z-20 whitespace-nowrap">
              TYPE: {mbtiCode}
            </div>
          </motion.div>

          {/* Title */}
          <h2 className="mt-6 text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-400 mb-6 uppercase tracking-tighter filter drop-shadow-[0_0_10px_rgba(0,255,255,0.3)] font-['Orbitron'] max-w-2xl leading-tight">
            {displayTitle}
          </h2>
          
          {/* Traits */}
          <div className="flex gap-3 mb-8 justify-center flex-wrap">
            {result.traits.map((trait, i) => (
              <span key={i} className="bg-gray-800/80 border border-gray-600 text-gray-200 text-sm px-4 py-1.5 rounded-full shadow-sm hover:border-cyan-500/50 hover:text-cyan-300 transition-colors cursor-default">
                {trait}
              </span>
            ))}
          </div>

          {/* Description */}
          <div className="max-w-xl mb-10">
             {descriptionSection}
          </div>

          {keyInfoVisibility === 'unhide' && (
            <>
              <div className="max-w-xl mb-10">
                {descriptionSectionAdult1}
              </div>
              <div className="max-w-xl mb-10">
                {descriptionSectionAdult2}
              </div>
              <div className="max-w-xl mb-4">
                {descriptionSectionAdult3}
              </div>
            </>
          )}
          
          <div className="my-6 flex justify-center">
            <RadioGroup
                value={keyInfoVisibility}
                onValueChange={setKeyInfoVisibility}
                className="flex gap-6"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unhide" id="r-unhide" className="bg-gray-800 border-gray-600" />
                    <Label htmlFor="r-unhide">{t('unhideKeyInfo')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hide" id="r-hide" className="bg-gray-800 border-gray-600" />
                    <Label htmlFor="r-hide">{t('hideKeyInfo')}</Label>
                </div>
            </RadioGroup>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={onRetest}
              className="group relative px-10 py-3 bg-transparent overflow-hidden rounded-lg font-mono text-sm transition-all hover:bg-purple-900/20"
            >
               <div className="absolute inset-0 border border-purple-500/50 rounded-lg group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"></div>
               <span className="text-purple-300 group-hover:text-purple-200 flex items-center gap-2">
                  &lt; {t('retest')} &gt;
               </span>
            </button>
            <button 
              onClick={handleShare}
              className="group relative px-6 py-3 bg-cyan-900/20 overflow-hidden rounded-lg font-mono text-sm transition-all hover:bg-cyan-900/40 shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
            >
               <div className="absolute inset-0 border border-cyan-500/50 rounded-lg"></div>
               <span className="text-cyan-300 group-hover:text-cyan-200 flex items-center gap-2 filter drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]">
                  <Send className="w-4 h-4" />
               </span>
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
