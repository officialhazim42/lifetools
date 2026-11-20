import React, { useState } from 'react';
import { GraduationCap, Dices, RotateCcw, Check, Sparkles, HelpCircle, History } from 'lucide-react';

const SAMPLE_BANKS: Record<string, string[]> = {
  'Computer Science': [
    'Explain the difference between a Process and a Thread.',
    'What is Polymorphism in Object-Oriented Programming and how does dynamic dispatch work?',
    'Explain ACID properties in Database Management Systems.',
    'What is the difference between TCP and UDP? Give real-world examples for each.',
    'How does Virtual Memory work, and what is Paging and Page Fault?',
    'Explain Breadth-First Search (BFS) vs Depth-First Search (DFS) applications.',
    'What is a Deadlock and what are the four necessary Coffman conditions?',
    'What is the purpose of Indexing in SQL databases and what data structures are used?'
  ],
  'Physics & Engineering': [
    'Explain Bernoulli’s Principle and its practical applications in aerodynamics.',
    'What is the Doppler Effect and how does redshift indicate cosmic expansion?',
    'State Faraday’s Law of Electromagnetic Induction.',
    'What is the difference between Stress and Strain? Define Young’s Modulus.',
    'Explain the principle behind Carnot Engine and Second Law of Thermodynamics.',
    'What is Total Internal Reflection and how do optical fibers utilize it?'
  ],
  'General Knowledge & Aptitude': [
    'What is the significance of the Fibonacci sequence in nature and computation?',
    'Explain how central banks use interest rates to control inflation.',
    'What is the difference between climate and weather?',
    'How does mRNA vaccine technology stimulate immune memory?',
    'What causes ocean tides on Earth?'
  ]
};

export const RandomQuestionPicker: React.FC = () => {
  const [bankText, setBankText] = useState(SAMPLE_BANKS['Computer Science'].join('\n'));
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [isNoRepeat, setIsNoRepeat] = useState(true);
  const [history, setHistory] = useState<string[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  // Parse questions
  const questions = bankText
    .split('\n')
    .map(q => q.trim())
    .filter(q => q.length > 0);

  const availableQuestions = isNoRepeat
    ? questions.filter(q => !history.includes(q))
    : questions;

  const handlePick = () => {
    if (availableQuestions.length === 0) return;

    setIsRolling(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const picked = availableQuestions[randomIndex];
      setCurrentQuestion(picked);
      setHistory(prev => [picked, ...prev]);
      setIsRolling(false);
    }, 250);
  };

  const handleReset = () => {
    setCurrentQuestion(null);
    setHistory([]);
  };

  const loadBank = (bankName: string) => {
    setBankText(SAMPLE_BANKS[bankName].join('\n'));
    handleReset();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" /> Student & Academic Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Random Question Picker
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Conduct mock viva exams, test recall under exam pressure, and randomly draw interview questions without repeats.
        </p>
      </div>

      {/* Preset Bank Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-medium text-slate-500 mr-1">Sample Banks:</span>
        {Object.keys(SAMPLE_BANKS).map(name => (
          <button
            key={name}
            onClick={() => loadBank(name)}
            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            {name}
          </button>
        ))}
      </div>

      {/* Main Question Display Box */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-8 shadow-sm text-center space-y-6 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-cyan-500" />
            Pool: {availableQuestions.length} remaining of {questions.length} total
          </span>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isNoRepeat}
              onChange={e => setIsNoRepeat(e.target.checked)}
              className="rounded accent-cyan-600"
            />
            <span>No-Repeat (Draw without replacement)</span>
          </label>
        </div>

        <div className="min-h-[140px] flex items-center justify-center py-6 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
          {currentQuestion ? (
            <div
              className={`text-xl sm:text-2xl font-bold text-slate-900 dark:text-white max-w-2xl leading-relaxed transition-all ${
                isRolling ? 'opacity-30 blur-xs' : 'opacity-100'
              }`}
            >
              "{currentQuestion}"
            </div>
          ) : (
            <div className="text-slate-400 text-sm italic">
              Click the button below to randomly draw a question!
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handlePick}
            disabled={availableQuestions.length === 0}
            className="w-full sm:w-auto px-8 py-3.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 text-base active:scale-95"
          >
            <Dices className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
            {availableQuestions.length === 0 ? 'All Questions Drawn' : 'Draw Next Question'}
          </button>

          {history.length > 0 && (
            <button
              onClick={handleReset}
              className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Pool
            </button>
          )}
        </div>
      </div>

      {/* Question Bank Input */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Edit Custom Question Bank (One question per line)
          </h3>
          <span className="text-xs text-slate-500">{questions.length} questions loaded</span>
        </div>
        <textarea
          rows={6}
          value={bankText}
          onChange={e => {
            setBankText(e.target.value);
            handleReset();
          }}
          placeholder="Type or paste your question list here, one per line..."
          className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 font-sans"
        />
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-500" /> Drawn Questions History ({history.length})
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {history.map((q, idx) => (
              <div key={idx} className="py-2.5 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                <span className="font-mono font-bold text-slate-400">#{history.length - idx}</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
