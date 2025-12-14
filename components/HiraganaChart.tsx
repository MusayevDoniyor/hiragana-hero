import React, { useState } from 'react';
import { HIRAGANA_DATA, TRANSLATIONS } from '../constants';
import { Kana, AppLanguage, FontStyle } from '../types';
import { generateMnemonic } from '../services/geminiService';
import { playSound } from '../services/audioService';
import { Check, X, Sparkles } from 'lucide-react';

interface HiraganaChartProps {
  language: AppLanguage;
  fontStyle: FontStyle;
  learnedChars: string[];
  toggleLearned: (char: string) => void;
}

const HiraganaChart: React.FC<HiraganaChartProps> = ({ language, fontStyle, learnedChars, toggleLearned }) => {
  const [selectedKana, setSelectedKana] = useState<Kana | null>(null);
  const [mnemonic, setMnemonic] = useState<string>('');
  const [loadingMnemonic, setLoadingMnemonic] = useState(false);
  
  const t = TRANSLATIONS[language];

  const handleKanaClick = async (kana: Kana) => {
    playSound.click();
    setSelectedKana(kana);
    setMnemonic('');
    setLoadingMnemonic(true);
    try {
      const mn = await generateMnemonic(kana.char, kana.romaji, language);
      setMnemonic(mn);
    } catch (e) {
      setMnemonic('Try visualizing the shape!');
    } finally {
      setLoadingMnemonic(false);
    }
  };

  const handleToggleLearned = (e: React.MouseEvent, char: string) => {
    e.stopPropagation();
    const isNowLearned = !learnedChars.includes(char);
    if (isNowLearned) {
      playSound.learned();
    } else {
      playSound.pop();
    }
    toggleLearned(char);
  };

  const closeModal = () => setSelectedKana(null);

  const isLearned = (char: string) => learnedChars.includes(char);

  return (
    <div className="p-4 pb-24 max-w-5xl mx-auto">
      <div className="mb-8 text-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{t.study}</h2>
        <div className="flex justify-center items-center gap-2">
           <div className="h-2 w-48 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-500" 
                style={{ width: `${(learnedChars.length / HIRAGANA_DATA.length) * 100}%` }}
              ></div>
           </div>
           <span className="text-xs font-bold text-slate-500">
             {Math.round((learnedChars.length / HIRAGANA_DATA.length) * 100)}%
           </span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 md:gap-4 select-none">
        {HIRAGANA_DATA.map((k) => (
          <div
            key={`${k.romaji}-${k.char}`}
            onClick={() => handleKanaClick(k)}
            className={`
              relative aspect-square rounded-xl shadow-sm border-2 transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95 group
              ${isLearned(k.char) 
                ? 'bg-green-50 border-green-400/30 shadow-green-100' 
                : 'bg-white border-slate-100 hover:border-red-300 hover:shadow-lg hover:-translate-y-1'
              }
            `}
          >
            {isLearned(k.char) && (
              <div className="absolute top-1 right-1 text-green-500 bg-white rounded-full p-0.5 shadow-sm">
                <Check size={12} strokeWidth={3} />
              </div>
            )}
            <span className={`text-2xl md:text-3xl lg:text-4xl ${fontStyle} text-slate-800 leading-none mb-1 group-hover:scale-110 transition-transform`}>{k.char}</span>
            <span className="text-[10px] md:text-xs text-slate-400 font-bold uppercase">{k.romaji}</span>
          </div>
        ))}
      </div>

      {selectedKana && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 bg-slate-50 rounded-full p-1"
            >
              <X size={24} />
            </button>
            
            <div className="text-center">
              <div className={`text-9xl ${fontStyle} text-slate-800 mb-2 drop-shadow-sm`}>{selectedKana.char}</div>
              <h3 className="text-2xl font-bold uppercase tracking-widest text-slate-400 mb-8">{selectedKana.romaji}</h3>
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 min-h-[120px] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-200 to-transparent opacity-50"></div>
                {loadingMnemonic ? (
                   <div className="flex items-center gap-2 text-slate-400">
                      <Sparkles size={16} className="animate-spin" />
                      <span className="text-sm font-medium">Asking AI for a trick...</span>
                   </div>
                ) : (
                  <>
                    <p className="text-slate-700 italic font-medium leading-relaxed relative z-10">"{mnemonic}"</p>
                    <Sparkles className="absolute bottom-2 right-2 text-yellow-400 opacity-20" size={40} />
                  </>
                )}
              </div>
              
              <button 
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg ${
                  isLearned(selectedKana.char) 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1'
                }`}
                onClick={(e) => handleToggleLearned(e, selectedKana.char)}
              >
                {isLearned(selectedKana.char) ? (
                  <>
                    <Check size={20} /> {t.learned}
                  </>
                ) : (
                   t.markLearned
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HiraganaChart;
