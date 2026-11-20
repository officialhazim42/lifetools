import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import { copyToClipboard } from '../../../utils/formatters';
import {
  FileText,
  Plus,
  Trash2,
  Copy,
  Download,
  Search,
  Pin,
  Clock
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  updatedAt: number;
}

const STORAGE_KEY = 'lifetools_quick_notes';

export const QuickNotes: React.FC = () => {
  const { showToast } = useToast();
  const [notes, setNotes] = useState<Note[]>(() => {
    return storage.get<Note[]>(STORAGE_KEY, [
      {
        id: 'note_demo',
        title: 'Welcome to Quick Notes',
        content: 'Jot down meeting thoughts, research ideas, or instant snippets. Everything is automatically saved right in your browser.',
        pinned: true,
        updatedAt: Date.now()
      }
    ]);
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(() => notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    storage.set(STORAGE_KEY, notes);
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const handleCreateNote = () => {
    const newNote: Note = {
      id: 'note_' + Date.now(),
      title: 'Untitled Note',
      content: '',
      pinned: false,
      updatedAt: Date.now()
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    showToast('New note created');
  };

  const handleUpdateNote = (field: 'title' | 'content', value: string) => {
    if (!activeNote) return;
    setNotes(prev =>
      prev.map(n =>
        n.id === activeNote.id
          ? { ...n, [field]: value, updatedAt: Date.now() }
          : n
      )
    );
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = notes.filter(n => n.id !== id);
    setNotes(remaining);
    if (activeNoteId === id && remaining.length > 0) {
      setActiveNoteId(remaining[0].id);
    }
    showToast('Note deleted', 'info');
  };

  const handleCopyNote = () => {
    if (!activeNote) return;
    const text = `${activeNote.title}\n\n${activeNote.content}`;
    copyToClipboard(text);
    showToast('Note copied to clipboard!');
  };

  const handleDownloadNote = () => {
    if (!activeNote) return;
    storage.downloadFile(
      `${activeNote.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'note'}.txt`,
      activeNote.content,
      'text/plain;charset=utf-8'
    );
    showToast('Note downloaded');
  };

  const filteredNotes = notes.filter(n => {
    const q = searchQuery.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q);
  }).sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  const wordCount = activeNote?.content.trim() ? activeNote.content.trim().split(/\s+/).length : 0;
  const charCount = activeNote?.content.length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[640px]">
      {/* Sidebar Note List */}
      <div className="md:col-span-4 flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-emerald-500" /> Notes ({notes.length})
          </div>
          <button onClick={handleCreateNote} className="btn-primary text-xs py-1.5 px-2.5">
            <Plus className="w-3.5 h-3.5" /> New Note
          </button>
        </div>

        <div className="p-3 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-base pl-8 py-1.5 text-xs"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredNotes.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching notes found.
            </div>
          ) : (
            filteredNotes.map(n => (
              <div
                key={n.id}
                onClick={() => setActiveNoteId(n.id)}
                className={`p-3.5 cursor-pointer transition-colors relative flex items-start justify-between gap-2 ${
                  activeNote?.id === n.id
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-l-4 border-emerald-500'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {n.pinned && <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />}
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {n.title || 'Untitled Note'}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-1">
                    {n.content ? n.content.slice(0, 60) : 'Empty note...'}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {new Date(n.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handleTogglePin(n.id, e)}
                    className="p-1 text-slate-400 hover:text-amber-500 rounded transition-colors"
                    title={n.pinned ? 'Unpin note' : 'Pin note'}
                  >
                    <Pin className={`w-3 h-3 ${n.pinned ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteNote(n.id, e)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                    title="Delete note"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Note Editor Area */}
      <div className="md:col-span-8 flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden">
        {activeNote ? (
          <>
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleUpdateNote('title', e.target.value)}
                placeholder="Note Title"
                className="text-base font-bold text-slate-900 dark:text-white bg-transparent border-0 focus:outline-none w-full"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={handleCopyNote} className="btn-secondary text-xs py-1.5 px-2.5" title="Copy Content">
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button onClick={handleDownloadNote} className="btn-secondary text-xs py-1.5 px-2.5" title="Download as .txt">
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <textarea
              value={activeNote.content}
              onChange={(e) => handleUpdateNote('content', e.target.value)}
              placeholder="Start typing your note here... (Markdown, lists, and thoughts welcome)"
              className="flex-1 w-full p-4 bg-transparent resize-none text-sm text-slate-800 dark:text-slate-200 focus:outline-none leading-relaxed"
            />

            <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="flex items-center gap-4">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>Saved locally</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <FileText className="w-12 h-12 stroke-1 mb-2 text-slate-300 dark:text-slate-700" />
            <p className="text-sm font-semibold">Select or create a note</p>
          </div>
        )}
      </div>
    </div>
  );
};
