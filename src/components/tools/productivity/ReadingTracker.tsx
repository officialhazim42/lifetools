import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import {
  BookOpen,
  Plus,
  Trash2,
  Star,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  status: 'reading' | 'completed' | 'wishlist';
  rating: number;
  notes: string;
}

const STORAGE_KEY = 'lifetools_reading_tracker';

export const ReadingTracker: React.FC = () => {
  const { showToast } = useToast();
  const [books, setBooks] = useState<Book[]>(() => {
    return storage.get<Book[]>(STORAGE_KEY, [
      {
        id: 'book_1',
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        totalPages: 550,
        currentPage: 320,
        status: 'reading',
        rating: 5,
        notes: 'Exceptional deep dive on storage engines, replication, and distributed consensus.'
      },
      {
        id: 'book_2',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        totalPages: 464,
        currentPage: 464,
        status: 'completed',
        rating: 5,
        notes: 'Classic engineering principles and meaningful naming heuristics.'
      }
    ]);
  });

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState<number>(300);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [status, setStatus] = useState<Book['status']>('reading');

  useEffect(() => {
    storage.set(STORAGE_KEY, books);
  }, [books]);

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Enter a book title', 'warning');
      return;
    }

    const newBook: Book = {
      id: 'book_' + Date.now(),
      title: title.trim(),
      author: author.trim() || 'Unknown Author',
      totalPages: Math.max(1, totalPages),
      currentPage: Math.min(Math.max(0, currentPage), totalPages),
      status: currentPage >= totalPages ? 'completed' : status,
      rating: 5,
      notes: ''
    };

    setBooks(prev => [newBook, ...prev]);
    setTitle('');
    setAuthor('');
    setCurrentPage(0);
    showToast('Book added to library!');
  };

  const handleUpdateProgress = (id: string, page: number) => {
    setBooks(prev =>
      prev.map(b => {
        if (b.id !== id) return b;
        const validPage = Math.min(Math.max(0, page), b.totalPages);
        const nextStatus = validPage >= b.totalPages ? 'completed' : b.status === 'completed' ? 'reading' : b.status;
        return { ...b, currentPage: validPage, status: nextStatus };
      })
    );
  };

  const handleDeleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    showToast('Book removed', 'info');
  };

  const totalBooks = books.length;
  const completedBooks = books.filter(b => b.status === 'completed').length;
  const totalPagesRead = books.reduce((acc, b) => acc + (b.currentPage || 0), 0);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalBooks}
            </div>
            <div className="text-xs text-slate-500">Books in Library</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {completedBooks}
            </div>
            <div className="text-xs text-slate-500">Finished Books</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalPagesRead}
            </div>
            <div className="text-xs text-slate-500">Total Pages Read</div>
          </div>
        </div>
      </div>

      {/* Add Book Form */}
      <form onSubmit={handleAddBook} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-4">
          <input
            type="text"
            placeholder="Book Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-base text-xs"
          />
        </div>
        <div className="sm:col-span-3">
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="input-base text-xs"
          />
        </div>
        <div className="sm:col-span-2">
          <input
            type="number"
            min="1"
            placeholder="Total Pages"
            value={totalPages}
            onChange={(e) => setTotalPages(Number(e.target.value))}
            className="input-base text-xs"
          />
        </div>
        <div className="sm:col-span-3">
          <button type="submit" className="btn-primary w-full text-xs py-2.5">
            <Plus className="w-4 h-4" /> Add Book
          </button>
        </div>
      </form>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {books.map(book => {
          const progress = Math.min(100, Math.round(((book.currentPage || 0) / book.totalPages) * 100));

          return (
            <div
              key={book.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                    {book.title}
                  </h3>
                  <div className="text-xs text-slate-500">{book.author}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      book.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400'
                    }`}
                  >
                    {book.status}
                  </span>
                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>
                    Page {book.currentPage} of {book.totalPages}
                  </span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Quick Page Update */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <span className="text-slate-500">Update Page:</span>
                <input
                  type="number"
                  min="0"
                  max={book.totalPages}
                  value={book.currentPage}
                  onChange={(e) => handleUpdateProgress(book.id, Number(e.target.value))}
                  className="input-base text-xs py-1 px-2 w-20 text-center font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateProgress(book.id, book.currentPage + 10)}
                  className="btn-secondary text-[11px] py-1 px-2"
                >
                  +10 pages
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateProgress(book.id, book.totalPages)}
                  className="btn-secondary text-[11px] py-1 px-2 text-emerald-600"
                >
                  Mark Done
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
