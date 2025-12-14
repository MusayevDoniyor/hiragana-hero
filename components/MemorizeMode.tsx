import React, { useState, useEffect } from 'react';
import { TRANSLATIONS, VOCAB_TOPICS } from '../constants';
import { AppLanguage, FontStyle, VocabTopic, VocabWord } from '../types';
import { playSound } from '../services/audioService';
import { generateVocab, validateAnswer } from '../services/geminiService';
import { 
  ArrowLeft, Play, Plus, Sparkles, Trash2, CheckCircle, 
  XCircle, RotateCcw, Award, Lightbulb
} from 'lucide-react';

interface MemorizeModeProps {
  language: AppLanguage;
  fontStyle: FontStyle;
}

const MemorizeMode: React.FC<MemorizeModeProps> = ({ language, fontStyle }) => {
  // Store ID instead of object to ensure reactivity when customWords updates
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [customWords, setCustomWords] = useState<VocabWord[]>([]);
  const [isPracticing, setIsPracticing] = useState(false);
  const [vocabProgress, setVocabProgress] = useState<Record<string, boolean>>({});
  
  // Custom word input state
  const [smartInput, setSmartInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const t = TRANSLATIONS[language];

  // Load Custom Words and Progress
  useEffect(() => {
    const savedWords = localStorage.getItem('hiragana_custom_words');
    const savedProgress = localStorage.getItem('hiragana_vocab_progress');
    
    if (savedWords) {
      try { setCustomWords(JSON.parse(savedWords)); } catch (e) { console.error(e); }
    }
    if (savedProgress) {
      try { setVocabProgress(JSON.parse(savedProgress)); } catch (e) { console.error(e); }
    }
  }, []);

  const saveCustomWords = (words: VocabWord[]) => {
    setCustomWords(words);
    localStorage.setItem('hiragana_custom_words', JSON.stringify(words));
  };

  const updateProgress = (wordId: string, mastered: boolean) => {
    const newProgress = { ...vocabProgress, [wordId]: mastered };
    setVocabProgress(newProgress);
    localStorage.setItem('hiragana_vocab_progress', JSON.stringify(newProgress));
  };

  const handleSmartAdd = async () => {
    if (!smartInput.trim()) return;
    
    setIsAdding(true);
    playSound.click();

    try {
      const result = await generateVocab(smartInput, language);
      
      if (result) {
        const newWord: VocabWord = {
          id: Date.now().toString(),
          japanese: result.japanese,
          romaji: result.romaji,
          meaning: result.meaning
        };
        // State update will trigger re-render, deriving activeTopic with new word immediately
        saveCustomWords([...customWords, newWord]);
        setSmartInput('');
        playSound.success();
      } else {
        playSound.wrong();
        alert("Could not generate word. Please check your connection.");
      }
    } catch (e) {
      playSound.wrong();
    } finally {
      setIsAdding(false);
    }
  };

  const deleteCustomWord = (id: string) => {
    saveCustomWords(customWords.filter(w => w.id !== id));
    playSound.pop();
  };

  const resetTopicProgress = (topic: VocabTopic) => {
    if (confirm("Reset progress for this topic?")) {
      const newProgress = { ...vocabProgress };
      topic.words.forEach(w => delete newProgress[w.id]);
      setVocabProgress(newProgress);
      localStorage.setItem('hiragana_vocab_progress', JSON.stringify(newProgress));
      playSound.pop();
    }
  };

  // Combine static topics with the custom topic
  // Since this is calculated on every render, activeTopic will always be fresh
  const allTopics: VocabTopic[] = [
    ...VOCAB_TOPICS,
    {
      id: 'custom',
      title: { [AppLanguage.ENG]: 'My Words', [AppLanguage.UZB]: 'Mening so\'zlarim', [AppLanguage.RUS]: 'Мои слова', [AppLanguage.DEU]: 'Meine Wörter', [AppLanguage.JPN]: '単語帳' },
      words: customWords,
      isCustom: true
    }
  ];

  const activeTopic = allTopics.find(t => t.id === activeTopicId) || null;

  // Helper to calculate progress percentage
  const getProgress = (topic: VocabTopic) => {
    if (topic.words.length === 0) return 0;
    const learned = topic.words.filter(w => vocabProgress[w.id]).length;
    return Math.round((learned / topic.words.length) * 100);
  };

  if (isPracticing && activeTopic) {
    return (
      <FlashcardPractice 
        words={activeTopic.words} 
        fontStyle={fontStyle} 
        language={language}
        onExit={() => setIsPracticing(false)} 
        onMaster={(id) => updateProgress(id, true)}
        t={t}
      />
    );
  }

  return (
    <div className="p-4 pb-32 w-full max-w-7xl mx-auto">
      {!activeTopic ? (
        <>
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">{t.topics}</h2>
            <p className="text-slate-500 mt-1 text-sm md:text-base">Select a category to start memorizing.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {allTopics.map(topic => {
              const progress = getProgress(topic);
              const isComplete = progress === 100 && topic.words.length > 0;
              
              return (
                <button
                  key={topic.id}
                  onClick={() => { playSound.click(); setActiveTopicId(topic.id); }}
                  className={`
                    relative bg-white p-5 md:p-6 rounded-2xl shadow-sm border transition-all text-left overflow-hidden group hover:-translate-y-1 hover:shadow-lg
                    ${isComplete ? 'border-green-200' : 'border-slate-100 hover:border-red-200'}
                  `}
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg md:text-xl font-bold text-slate-800 group-hover:text-red-600 transition-colors">
                        {topic.title[language] || topic.title[AppLanguage.ENG]}
                      </h3>
                      {isComplete && <Award className="text-green-500" size={24} />}
                    </div>
                    <p className="text-slate-500 text-xs md:text-sm mb-5 font-medium flex items-center gap-2">
                       <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">{topic.words.length} words</span>
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isComplete ? 'bg-green-500' : 'bg-red-500'}`} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-right text-[10px] md:text-xs font-bold text-slate-400">
                      {progress}% Mastered
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <div className="animate-fade-in">
          <div className="flex items-center gap-4 mb-6 md:mb-8">
            <button 
              onClick={() => setActiveTopicId(null)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-red-500 transition-colors shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 truncate">
              {activeTopic.title[language] || activeTopic.title[AppLanguage.ENG]}
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Left Column: Stats & Actions */}
            <div className="w-full lg:w-1/3 flex flex-col gap-6 order-2 lg:order-1">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                     <svg className="w-32 h-32 transform -rotate-90">
                       <circle className="text-slate-100" strokeWidth="10" stroke="currentColor" fill="transparent" r="56" cx="64" cy="64"/>
                       <circle 
                          className={`${getProgress(activeTopic) === 100 ? 'text-green-500' : 'text-red-500'} transition-all duration-1000 ease-out`} 
                          strokeWidth="10" 
                          strokeDasharray={351} 
                          strokeDashoffset={351 - (351 * getProgress(activeTopic)) / 100} 
                          strokeLinecap="round" 
                          stroke="currentColor" 
                          fill="transparent" 
                          r="56" cx="64" cy="64" 
                        />
                     </svg>
                     <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-slate-800">{getProgress(activeTopic)}%</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Done</span>
                     </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => { playSound.click(); setIsPracticing(true); }}
                  disabled={activeTopic.words.length === 0}
                  className="w-full bg-red-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-100 hover:bg-red-600 hover:shadow-red-200 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  <Play size={20} fill="currentColor" /> {t.practice}
                </button>
                
                {getProgress(activeTopic) > 0 && (
                  <button 
                    onClick={() => resetTopicProgress(activeTopic)}
                    className="w-full mt-4 flex items-center justify-center gap-2 text-slate-400 text-sm font-bold hover:text-red-500 py-2 transition-colors"
                  >
                    <RotateCcw size={14} /> {t.reset}
                  </button>
                )}
              </div>

              {activeTopic.isCustom && (
                <div className="bg-slate-800 p-6 rounded-2xl text-white shadow-xl ring-1 ring-white/10">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-lg">
                    <Sparkles size={18} className="text-yellow-400" /> {t.addWord}
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <input 
                        value={smartInput} 
                        onChange={e => setSmartInput(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleSmartAdd()}
                        placeholder="e.g. 'cat' or 'neko'" 
                        disabled={isAdding}
                        className="w-full p-4 pr-12 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition-all"
                      />
                      {isAdding && (
                        <div className="absolute right-4 top-4">
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={handleSmartAdd} 
                      disabled={isAdding || !smartInput.trim()}
                      className={`
                        w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                        ${isAdding ? 'bg-slate-600 cursor-wait opacity-50' : 'bg-white text-slate-900 hover:bg-slate-100 shadow-lg'}
                      `}
                    >
                      <Plus size={18} /> {isAdding ? 'AI Translating...' : 'Smart Add'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-4 leading-relaxed border-t border-slate-700 pt-3">
                    Type a word in English or Romaji. AI will automatically translate and add it to your list.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Word List */}
            <div className="w-full lg:w-2/3 order-1 lg:order-2">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full lg:max-h-[700px] min-h-[400px]">
                <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-500 text-sm uppercase flex justify-between items-center">
                  <span>Word List</span>
                  <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{activeTopic.words.length}</span>
                </div>
                <div className="divide-y divide-slate-100 overflow-y-auto flex-1 custom-scrollbar">
                  {activeTopic.words.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                         <Lightbulb size={32} className="text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-medium">No words yet.</p>
                      {activeTopic.isCustom && <p className="text-slate-400 text-sm mt-1">Use Smart Add to get started!</p>}
                    </div>
                  ) : (
                    activeTopic.words.map(word => {
                      const isMastered = vocabProgress[word.id];
                      return (
                        <div key={word.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center group">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-lg transition-colors ${isMastered ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-300'}`}>
                              {isMastered ? <CheckCircle size={18} /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                            </div>
                            <div>
                              <div className={`text-lg md:text-xl font-bold text-slate-800 ${fontStyle}`}>{word.japanese}</div>
                              <div className="text-[10px] md:text-xs text-slate-400 font-mono mt-0.5">{word.romaji}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 md:gap-4">
                            <div className="text-right">
                              <div className="font-bold text-slate-700 text-xs md:text-sm bg-slate-100 px-2 py-1 rounded max-w-[120px] md:max-w-xs truncate">{word.meaning}</div>
                            </div>
                            {activeTopic.isCustom && (
                              <button 
                                onClick={() => deleteCustomWord(word.id)} 
                                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-300 hover:bg-red-50 hover:text-red-500 transition-colors md:opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------------
// Flashcard Sub-Component
// ----------------------------------------------------------------------

const FlashcardPractice: React.FC<{ 
  words: VocabWord[], 
  fontStyle: FontStyle, 
  language: AppLanguage,
  onExit: () => void,
  onMaster: (id: string) => void,
  t: any
}> = ({ words, fontStyle, language, onExit, onMaster, t }) => {
  const [queue, setQueue] = useState([...words].sort(() => Math.random() - 0.5));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);
  const [results, setResults] = useState({ correct: 0, wrong: 0 });
  
  // Interactive Input State
  const [userInput, setUserInput] = useState('');
  const [checkStatus, setCheckStatus] = useState<'idle' | 'checking' | 'correct' | 'wrong'>('idle');

  const currentCard = queue[currentIdx];

  const handleCheck = async () => {
    if (!userInput.trim()) return;
    
    setCheckStatus('checking');
    
    // 1. Simple Check first (Exact match)
    const exactMatch = userInput.trim().toLowerCase() === currentCard.meaning.toLowerCase();
    
    if (exactMatch) {
      handleCheckResult(true);
      return;
    }
    
    // 2. AI Check (Fuzzy match / Synonyms)
    const isValid = await validateAnswer(userInput, currentCard.meaning, language);
    handleCheckResult(isValid);
  };
  
  const handleCheckResult = (isCorrect: boolean) => {
    if (isCorrect) {
      setCheckStatus('correct');
      playSound.correct();
      // Auto flip after short delay
      setTimeout(() => setFlipped(true), 800);
    } else {
      setCheckStatus('wrong');
      playSound.wrong();
    }
  };

  const handleNext = (master: boolean) => {
    // Determine mastery logic: 
    // If they got it right via input (checkStatus === 'correct') OR clicked "Easy"
    const isMastered = master || checkStatus === 'correct';

    if (isMastered) {
      if (checkStatus !== 'correct') playSound.correct(); // Play sound if jumping straight to Easy without checking
      setResults(p => ({ ...p, correct: p.correct + 1 }));
      onMaster(currentCard.id);
    } else {
      playSound.wrong();
      setResults(p => ({ ...p, wrong: p.wrong + 1 }));
    }

    // Reset state for next card
    if (currentIdx < queue.length - 1) {
      setFlipped(false);
      setCheckStatus('idle');
      setUserInput('');
      setTimeout(() => setCurrentIdx(c => c + 1), 300);
    } else {
      setFinished(true);
      playSound.success();
    }
  };

  const handleSkip = () => {
    setFlipped(true);
    setCheckStatus('idle'); // Neutral state
    playSound.flip();
  };

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center animate-fade-in">
        <div className="w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mb-6 shadow-sm animate-bounce">
          <Award size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Practice Complete!</h2>
        <p className="text-slate-500 mb-8">You've reviewed {queue.length} words.</p>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
           <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex flex-col items-center">
             <div className="text-green-500 font-bold text-4xl mb-1">{results.correct}</div>
             <div className="text-green-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
               <CheckCircle size={12} /> Mastered
             </div>
           </div>
           <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex flex-col items-center">
             <div className="text-orange-500 font-bold text-4xl mb-1">{results.wrong}</div>
             <div className="text-orange-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
               <RotateCcw size={12} /> Review
             </div>
           </div>
        </div>
        
        <button onClick={onExit} className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors shadow-lg flex items-center gap-2">
          <ArrowLeft size={18} /> Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 w-full max-w-md mx-auto">
      <div className="w-full flex justify-between items-center mb-6">
        <div className="text-slate-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          <span className="bg-slate-100 px-2 py-1 rounded">
             {currentIdx + 1} / {queue.length}
          </span>
        </div>
        <button 
          onClick={onExit}
          className="text-slate-400 hover:text-slate-600 font-bold text-sm flex items-center gap-1"
        >
          <XCircle size={16} /> Exit
        </button>
      </div>

      {/* 3D Flip Container */}
      <div className="group perspective-1000 w-full aspect-[4/5] sm:aspect-[3/4] mb-6 relative">
        <div className={`relative w-full h-full transition-all duration-700 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front Face (Japanese + Input) */}
          <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col items-center justify-between p-6 md:p-8 select-none">
            <div className="flex-1 flex flex-col items-center justify-center">
              <span className={`text-6xl sm:text-7xl ${fontStyle} text-slate-800 text-center mb-4`}>{currentCard.japanese}</span>
            </div>
            
            <div className="w-full">
               <div className="mb-2 text-center">
                  <span className={`text-sm font-bold transition-colors ${checkStatus === 'wrong' ? 'text-red-500' : 'text-slate-400'}`}>
                    {checkStatus === 'wrong' ? 'Try again!' : 'What does this mean?'}
                  </span>
               </div>
               
               <div className="relative">
                 <input 
                    type="text" 
                    value={userInput}
                    onChange={(e) => { setUserInput(e.target.value); if(checkStatus === 'wrong') setCheckStatus('idle'); }}
                    onKeyDown={(e) => e.key === 'Enter' && checkStatus !== 'correct' && handleCheck()}
                    placeholder="Type meaning..."
                    disabled={checkStatus === 'correct'}
                    className={`
                      w-full p-4 rounded-xl border-2 text-center text-lg font-bold outline-none transition-all
                      ${checkStatus === 'correct' ? 'border-green-500 bg-green-50 text-green-700' : 
                        checkStatus === 'wrong' ? 'border-red-400 bg-red-50' : 
                        'border-slate-200 focus:border-red-400 focus:ring-4 focus:ring-red-50'}
                    `}
                 />
                 <button 
                    onClick={handleCheck}
                    disabled={!userInput.trim() || checkStatus === 'correct'}
                    className="absolute right-2 top-2 bottom-2 bg-slate-800 text-white rounded-lg px-3 flex items-center justify-center disabled:opacity-0 transition-opacity"
                 >
                    {checkStatus === 'checking' ? (
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                       <Play size={16} fill="currentColor" />
                    )}
                 </button>
               </div>
            </div>
            
            <button 
              onClick={handleSkip}
              className="mt-4 text-slate-400 text-sm font-medium hover:text-slate-600 flex items-center gap-1"
            >
              Don't know? Flip <RotateCcw size={12} />
            </button>
          </div>

          {/* Back Face (Answer) */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-slate-900 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 select-none border-4 border-slate-800">
            <div className="bg-slate-800 p-4 rounded-full mb-6">
               <CheckCircle className="text-green-400" size={40} />
            </div>
            <span className="text-4xl text-white font-bold mb-4 text-center leading-tight">{currentCard.meaning}</span>
            <div className="w-12 h-1 bg-slate-700 rounded-full mb-4"></div>
            <span className="text-2xl text-red-400 font-mono font-medium tracking-wider">{currentCard.romaji}</span>
          </div>

        </div>
      </div>

      {/* Controls - Only visible when flipped */}
      <div className={`w-full grid grid-cols-2 gap-4 transition-all duration-300 ${flipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button 
          onClick={() => handleNext(false)} 
          className="py-4 bg-white border-2 border-orange-100 text-orange-500 rounded-xl font-bold hover:bg-orange-50 hover:border-orange-200 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} /> Hard
        </button>
        <button 
          onClick={() => handleNext(true)} 
          className="py-4 bg-green-500 border-2 border-green-600 text-white rounded-xl font-bold hover:bg-green-600 transition-all shadow-md shadow-green-200 active:scale-95 flex items-center justify-center gap-2"
        >
          <CheckCircle size={18} /> Easy
        </button>
      </div>
    </div>
  );
};

export default MemorizeMode;
