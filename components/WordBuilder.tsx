import React, { useState } from 'react';
import { HIRAGANA_DATA, TRANSLATIONS } from '../constants';
import { analyzeWord } from '../services/geminiService';
import { WordAnalysis, AppLanguage, FontStyle } from '../types';
import { playSound } from '../services/audioService';
import { Eraser, Search, ArrowRight, Quote } from 'lucide-react';

interface WordBuilderProps {
  language: AppLanguage;
  fontStyle: FontStyle;
}

const WordBuilder: React.FC<WordBuilderProps> = ({ language, fontStyle }) => {
  const [builtWord, setBuiltWord] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<WordAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const t = TRANSLATIONS[language];

  const handleAddChar = (char: string) => {
    playSound.click();
    if (builtWord.length < 8) {
      setBuiltWord([...builtWord, char]);
      setAnalysis(null);
    }
  };

  const handleRemoveChar = (index: number) => {
    playSound.pop();
    const newWord = [...builtWord];
    newWord.splice(index, 1);
    setBuiltWord(newWord);
    setAnalysis(null);
  };

  const handleClear = () => {
    playSound.pop();
    setBuiltWord([]);
    setAnalysis(null);
  };

  const handleAnalyze = async () => {
    if (builtWord.length === 0) return;
    
    setLoading(true);
    playSound.click();
    const wordString = builtWord.join('');
    const result = await analyzeWord(wordString, language);
    setAnalysis(result);
    setLoading(false);
    if (result.isValid) {
      playSound.success();
    } else {
      playSound.wrong();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 pb-32">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{t.build}</h2>
        <p className="text-slate-500 text-sm">Tap characters to build a word.</p>
      </div>

      {/* Input Display Area */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 min-h-[160px] flex flex-col justify-between mb-8 relative overflow-hidden">
        {/* The Word */}
        <div className="flex flex-wrap gap-2 items-center justify-center min-h-[80px]">
          {builtWord.length === 0 && (
            <span className="text-slate-300 italic flex flex-col items-center gap-2">
               <span className="text-3xl">☝️</span>
               Select Hiragana below...
            </span>
          )}
          {builtWord.map((char, idx) => (
            <button
              key={`${char}-${idx}`}
              onClick={() => handleRemoveChar(idx)}
              className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-slate-50 border-2 border-slate-100 rounded-xl text-2xl md:text-3xl ${fontStyle} hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm animate-scale-in`}
            >
              {char}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mt-6">
          <button 
            onClick={handleClear}
            disabled={builtWord.length === 0}
            className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 flex items-center gap-2 transition-colors font-bold text-sm"
          >
            <Eraser size={16} /> {t.clear}
          </button>
          <button 
            onClick={handleAnalyze}
            disabled={builtWord.length === 0 || loading}
            className={`
              flex items-center gap-2 px-6 md:px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all
              ${loading ? 'bg-slate-400 cursor-wait' : 'bg-red-500 hover:bg-red-600 active:scale-95 shadow-red-200'}
              disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
            `}
          >
            {loading ? (
              <>Checking...</>
            ) : (
              <>
                <span>{t.analyze}</span>
                <Search size={18} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Result */}
      {analysis && (
        <div className={`mb-8 p-6 rounded-2xl border animate-slide-up shadow-sm ${analysis.isValid ? 'bg-green-50/50 border-green-200' : 'bg-orange-50/50 border-orange-200'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className={`font-bold text-lg flex items-center gap-2 ${analysis.isValid ? 'text-green-700' : 'text-orange-700'}`}>
                {analysis.isValid ? 'Valid Word' : 'Not quite a common word'}
              </h3>
              <p className="text-2xl font-mono text-slate-800 mt-1 font-bold tracking-wide">{analysis.reading}</p>
            </div>
            <span className="text-4xl">{analysis.isValid ? '🎯' : '🤔'}</span>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100/50 shadow-sm">
               <p className="text-slate-800 font-bold text-lg mb-1">{analysis.meaning}</p>
               <p className="text-slate-500 text-sm">{analysis.breakdown}</p>
            </div>
            
            {analysis.examples && analysis.examples.length > 0 && (
              <div className="pt-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                   <Quote size={12} /> {t.examples}
                </p>
                <ul className="space-y-3">
                  {analysis.examples.map((ex, i) => (
                    <li key={i} className="text-sm bg-white/60 p-3 rounded-lg border border-slate-100">
                      <p className={`font-bold text-slate-800 ${fontStyle} text-lg mb-1`}>{ex.japanese}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-slate-500">
                         <p className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded w-fit">{ex.romaji}</p>
                         <ArrowRight size={12} className="hidden sm:block text-slate-300" />
                         <p className="italic text-slate-600">{ex.translation}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Keyboard Grid */}
      <div className="flex-1">
        <div className="grid grid-cols-5 gap-2 pb-10">
          {HIRAGANA_DATA.map((k) => (
            <button
              key={k.char}
              onClick={() => handleAddChar(k.char)}
              className="bg-white p-1 rounded-xl shadow-sm border-b-2 border-slate-100 hover:bg-slate-50 hover:border-red-200 hover:text-red-500 active:translate-y-0.5 active:shadow-none active:border-t-2 transition-all flex flex-col items-center justify-center min-h-[50px] md:min-h-[64px]"
            >
              <span className={`text-lg md:text-xl ${fontStyle} font-medium`}>{k.char}</span>
              <span className="text-[9px] text-slate-400 uppercase font-bold">{k.romaji}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordBuilder;
