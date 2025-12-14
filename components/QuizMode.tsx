import React, { useState, useEffect, useCallback } from 'react';
import { HIRAGANA_DATA, ROWS, TRANSLATIONS } from '../constants';
import { Kana, QuizQuestion, AppLanguage, FontStyle } from '../types';
import { playSound } from '../services/audioService';
import { Flame, Trophy, Target } from 'lucide-react';
import CustomSelect from './ui/CustomSelect';

interface QuizModeProps {
  language: AppLanguage;
  fontStyle: FontStyle;
}

const QuizMode: React.FC<QuizModeProps> = ({ language, fontStyle }) => {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [limitRowIndex, setLimitRowIndex] = useState<number>(ROWS.length - 1); // Default to all

  const t = TRANSLATIONS[language];

  // Load High Score on Mount
  useEffect(() => {
    const savedHigh = localStorage.getItem('hiragana_highscore');
    if (savedHigh) setHighScore(parseInt(savedHigh, 10));
  }, []);

  const generateQuestion = useCallback(() => {
    const allowedRows = ROWS.slice(0, limitRowIndex + 1);
    const pool = HIRAGANA_DATA.filter(k => allowedRows.includes(k.row));

    if (pool.length < 4) return;

    const correctKana = pool[Math.floor(Math.random() * pool.length)];
    
    const options = new Set<string>();
    options.add(correctKana.romaji);
    
    while (options.size < 4) {
      const randomKana = pool[Math.floor(Math.random() * pool.length)];
      options.add(randomKana.romaji);
    }

    setCurrentQuestion({
      kana: correctKana,
      options: Array.from(options).sort(() => Math.random() - 0.5),
    });
    setFeedback(null);
  }, [limitRowIndex]);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = (answer: string) => {
    if (!currentQuestion || feedback) return;

    if (answer === currentQuestion.kana.romaji) {
      playSound.correct();
      const newScore = score + 10;
      setScore(newScore);
      setStreak(s => s + 1);
      setFeedback('correct');
      
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('hiragana_highscore', newScore.toString());
      }
      setTimeout(generateQuestion, 1000);
    } else {
      playSound.wrong();
      setStreak(0);
      setFeedback('wrong');
      setTimeout(generateQuestion, 1500);
    }
  };

  const rowOptions = ROWS.map((row, idx) => ({
    label: `Limit: Up to ${row.toUpperCase()}-row`,
    value: idx.toString()
  }));

  if (!currentQuestion) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-start min-h-[70vh] p-4 max-w-lg mx-auto pb-24">
      
      {/* Settings Bar */}
      <div className="w-full mb-8">
        <CustomSelect 
          value={limitRowIndex.toString()}
          options={rowOptions}
          onChange={(v) => {
             setLimitRowIndex(parseInt(v));
             setScore(0);
             setStreak(0);
          }}
          className="w-full"
        />
      </div>

      <div className="w-full grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
           <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Target size={10} /> {t.score}</span>
           <span className="text-2xl font-bold text-slate-700">{score}</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 w-full h-1 bg-orange-400 opacity-20"></div>
          <span className="text-orange-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Flame size={10} /> Streak</span>
          <span className="text-2xl font-bold text-orange-500">{streak}</span>
        </div>
        <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center">
           <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"><Trophy size={10} /> Best</span>
           <span className="text-2xl font-bold text-slate-700">{highScore}</span>
        </div>
      </div>

      <div className={`
        w-48 h-48 flex items-center justify-center rounded-3xl bg-white shadow-xl border-4 mb-8 transition-colors duration-300 transform
        ${feedback === 'correct' ? 'border-green-400 bg-green-50 scale-105' : ''}
        ${feedback === 'wrong' ? 'border-red-400 bg-red-50 shake' : 'border-slate-100'}
      `}>
        <span className={`text-8xl ${fontStyle} text-slate-800`}>{currentQuestion.kana.char}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {currentQuestion.options.map((opt) => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={!!feedback}
            className={`
              py-5 rounded-xl font-bold text-xl uppercase tracking-wider transition-all
              ${feedback === 'correct' && opt === currentQuestion.kana.romaji 
                ? 'bg-green-500 text-white shadow-green-200 shadow-lg scale-105 ring-4 ring-green-100' 
                : feedback === 'wrong' && opt === currentQuestion.kana.romaji
                  ? 'bg-green-500 text-white opacity-50' 
                  : ''
              }
              ${feedback === 'wrong' && opt !== currentQuestion.kana.romaji
                 ? 'bg-slate-100 text-slate-300 scale-95'
                 : ''
              }
              ${!feedback 
                ? 'bg-white text-slate-700 hover:bg-slate-50 hover:text-red-500 hover:border-red-200 border-2 border-slate-100 shadow-sm' 
                : ''
              }
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizMode;
