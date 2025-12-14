import React, { useState, useEffect } from 'react';
import { AppMode, AppLanguage, FontStyle } from './types';
import HiraganaChart from './components/HiraganaChart';
import QuizMode from './components/QuizMode';
import WordBuilder from './components/WordBuilder';
import MemorizeMode from './components/MemorizeMode';
import CustomSelect from './components/ui/CustomSelect';
import { TRANSLATIONS } from './constants';
import { playSound } from './services/audioService';
import { BookOpen, Brain, Gamepad2, Puzzle, Type, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.LEARN);
  const [language, setLanguage] = useState<AppLanguage>(AppLanguage.ENG);
  const [fontStyle, setFontStyle] = useState<FontStyle>(FontStyle.SANS);
  const [learnedChars, setLearnedChars] = useState<string[]>([]);

  const t = TRANSLATIONS[language];

  // Load persistence
  useEffect(() => {
    const savedLearned = localStorage.getItem('hiragana_learned');
    if (savedLearned) {
      try {
        setLearnedChars(JSON.parse(savedLearned));
      } catch (e) {
        console.error("Failed to parse learned chars");
      }
    }
  }, []);

  const toggleLearned = (char: string) => {
    setLearnedChars(prev => {
      const next = prev.includes(char) 
        ? prev.filter(c => c !== char) 
        : [...prev, char];
      localStorage.setItem('hiragana_learned', JSON.stringify(next));
      return next;
    });
  };

  const handleNavClick = (m: AppMode) => {
    playSound.click();
    setMode(m);
  };

  const fontOptions = [
    { label: 'Gothic', value: FontStyle.SANS },
    { label: 'Handwritten', value: FontStyle.HAND },
    { label: 'Mincho', value: FontStyle.SERIF },
  ];

  const langOptions = Object.values(AppLanguage).map(lang => ({
    label: lang,
    value: lang
  }));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Top Row: Logo & Settings */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white font-bold text-xl jp-font shadow-lg shadow-red-200 rotate-3">
                あ
              </div>
              <h1 className="font-bold text-2xl tracking-tight text-slate-800">
                Hiragana<span className="text-red-500">Hero</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <CustomSelect 
                value={fontStyle} 
                options={fontOptions} 
                onChange={(v) => setFontStyle(v as FontStyle)} 
                className="z-30"
              />
              <CustomSelect 
                value={language} 
                options={langOptions} 
                onChange={(v) => setLanguage(v as AppLanguage)} 
                className="z-30 mr-8"
                align="right"
              />
            </div>
          </div>

          {/* Bottom Row: Navigation Tabs */}
          <nav className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
             <NavButton active={mode === AppMode.LEARN} onClick={() => handleNavClick(AppMode.LEARN)} label={t.study} icon={<BookOpen size={18} />} />
             <NavButton active={mode === AppMode.MEMORIZE} onClick={() => handleNavClick(AppMode.MEMORIZE)} label={t.memorize} icon={<Brain size={18} />} />
             <NavButton active={mode === AppMode.QUIZ} onClick={() => handleNavClick(AppMode.QUIZ)} label={t.quiz} icon={<Gamepad2 size={18} />} />
             <NavButton active={mode === AppMode.BUILDER} onClick={() => handleNavClick(AppMode.BUILDER)} label={t.build} icon={<Puzzle size={18} />} />
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto animate-fade-in">
        {mode === AppMode.LEARN && (
          <HiraganaChart 
            language={language} 
            fontStyle={fontStyle} 
            learnedChars={learnedChars}
            toggleLearned={toggleLearned}
          />
        )}
        {mode === AppMode.MEMORIZE && (
          <MemorizeMode 
            language={language} 
            fontStyle={fontStyle}
          />
        )}
        {mode === AppMode.QUIZ && (
          <QuizMode 
            language={language} 
            fontStyle={fontStyle}
          />
        )}
        {mode === AppMode.BUILDER && (
          <WordBuilder 
            language={language} 
            fontStyle={fontStyle}
          />
        )}
      </main>
    </div>
  );
};

// Helper Components for Nav

const NavButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap text-sm border
      ${active 
        ? 'bg-slate-800 text-white border-slate-800 shadow-lg shadow-slate-200' 
        : 'bg-white text-slate-500 border-transparent hover:bg-slate-100 hover:text-slate-700'}
    `}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;