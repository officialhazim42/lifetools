import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Trash2, RotateCw, CheckCircle, HelpCircle, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react';
import { safeStorage } from '../../../utils/storage';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  mastered: boolean;
}

const STORAGE_KEY = 'lifetools_flashcards';

const DEFAULT_CARDS: Flashcard[] = [
  {
    id: '1',
    front: 'What is Time Complexity of Binary Search?',
    back: 'O(log n) because the search space is halved in each step.',
    mastered: false
  },
  {
    id: '2',
    front: 'What is the First Law of Thermodynamics?',
    back: 'Energy cannot be created or destroyed, only transformed from one form to another (ΔU = Q - W).',
    mastered: false
  },
  {
    id: '3',
    front: 'What is Mitochondria commonly known as?',
    back: 'The Powerhouse of the Cell, generating most of the chemical energy needed (ATP).',
    mastered: true
  }
];

export const FlashcardCreator: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>(() => {
    return safeStorage.get(STORAGE_KEY, DEFAULT_CARDS);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  useEffect(() => {
    safeStorage.set(STORAGE_KEY, cards);
  }, [cards]);

  const currentCard = cards[currentIndex] || null;

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCards(prev => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  };

  const toggleMastered = (id: string) => {
    setCards(prev =>
      prev.map(c => (c.id === id ? { ...c, mastered: !c.mastered } : c))
    );
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    const newCard: Flashcard = {
      id: 'card_' + Date.now(),
      front: newFront.trim(),
      back: newBack.trim(),
      mastered: false
    };

    setCards(prev => [...prev, newCard]);
    setNewFront('');
    setNewBack('');
  };

  const handleDeleteCard = (id: string) => {
    setCards(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (currentIndex >= filtered.length) {
        setCurrentIndex(Math.max(0, filtered.length - 1));
      }
      return filtered;
    });
  };

  const masteredCount = cards.filter(c => c.mastered).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" /> Student & Academic Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Flashcard Creator & Study Deck
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Create custom study flashcards, flip to test recall, shuffle decks, and track mastery.
        </p>
      </div>

      {/* Flashcard Viewer */}
      {cards.length > 0 && currentCard ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>
              Card {currentIndex + 1} of {cards.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 dark:text-emerald-400">
                {masteredCount} Mastered
              </span>
              <span>•</span>
              <button
                onClick={handleShuffle}
                className="inline-flex items-center gap-1 hover:text-cyan-600 transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" /> Shuffle Deck
              </button>
            </div>
          </div>

          {/* Interactive Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[260px] bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-800 p-8 shadow-md flex flex-col justify-between items-center text-center transition-all hover:border-cyan-500 select-none relative group"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              {isFlipped ? '💡 Answer / Explanation' : '❓ Question / Prompt'}
            </div>

            <div className="text-xl sm:text-2xl font-medium text-slate-900 dark:text-white max-w-lg my-6">
              {isFlipped ? currentCard.back : currentCard.front}
            </div>

            <div className="text-xs text-slate-400 flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5" /> Click anywhere to flip card
            </div>
          </div>

          {/* Card Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              disabled={cards.length <= 1}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 hover:bg-slate-200 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <button
              onClick={() => toggleMastered(currentCard.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                currentCard.mastered
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-emerald-500'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {currentCard.mastered ? 'Mastered!' : 'Mark as Mastered'}
            </button>

            <button
              onClick={handleNext}
              disabled={cards.length <= 1}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 disabled:opacity-50"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            No flashcards in your deck yet.
          </p>
        </div>
      )}

      {/* Add New Card Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Plus className="w-4 h-4 text-cyan-500" /> Add New Flashcard
        </h3>

        <form onSubmit={handleAddCard} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Front (Question / Term / Formula) *
              </label>
              <textarea
                required
                rows={3}
                value={newFront}
                onChange={e => setNewFront(e.target.value)}
                placeholder="e.g. What is Boyle's Law?"
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Back (Answer / Definition) *
              </label>
              <textarea
                required
                rows={3}
                value={newBack}
                onChange={e => setNewBack(e.target.value)}
                placeholder="e.g. Pressure of a gas is inversely proportional to its volume at constant temperature (P1V1 = P2V2)."
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add to Deck
            </button>
          </div>
        </form>
      </div>

      {/* Deck List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          All Cards in Deck ({cards.length})
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {cards.map((c, i) => (
            <div key={c.id} className="py-3 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-slate-400">#{i + 1}</span>
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">
                    {c.front}
                  </span>
                  {c.mastered && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">
                      Mastered
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{c.back}</p>
              </div>
              <button
                onClick={() => handleDeleteCard(c.id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
