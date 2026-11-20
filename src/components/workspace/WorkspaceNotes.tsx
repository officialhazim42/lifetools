import React, { useState, useEffect } from 'react';
import { workspaceDB } from '../../utils/workspaceDB';
import { WorkspaceNote } from '../../types/workspace';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit3,
  Check,
  X,
  Tag,
  Clock,
  Sparkles,
  Palette
} from 'lucide-react';

const CATEGORIES = ['All', 'General', 'Work', 'Personal', 'Ideas', 'Projects', 'Meeting'];

const NOTE_COLORS = [
  { name: 'Default', bg: 'bg-white dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700' },
  { name: 'Blue', bg: 'bg-blue-50/70 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-800/60' },
  { name: 'Emerald', bg: 'bg-emerald-50/70 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800/60' },
  { name: 'Amber', bg: 'bg-amber-50/70 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800/60' },
  { name: 'Rose', bg: 'bg-rose-50/70 dark:bg-rose-950/30', border: 'border-rose-200 dark:border-rose-800/60' },
  { name: 'Purple', bg: 'bg-purple-50/70 dark:bg-purple-950/30', border: 'border-purple-200 dark:border-purple-800/60' },
];

export const WorkspaceNotes: React.FC = () => {
  const [notes, setNotes] = useState<WorkspaceNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingNote, setEditingNote] = useState<WorkspaceNote | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formColor, setFormColor] = useState('Default');
  const [formPinned, setFormPinned] = useState(false);

  const loadNotes = async () => {
    const list = await workspaceDB.getNotes();
    setNotes(list);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const openNewNoteModal = () => {
    setEditingNote(null);
    setFormTitle('');
    setFormContent('');
    setFormCategory('General');
    setFormColor('Default');
    setFormPinned(false);
    setIsEditorOpen(true);
  };

  const openEditNoteModal = (note: WorkspaceNote) => {
    setEditingNote(note);
    setFormTitle(note.title);
    setFormContent(note.content);
    setFormCategory(note.category || 'General');
    setFormColor(note.color || 'Default');
    setFormPinned(note.isPinned);
    setIsEditorOpen(true);
  };

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() && !formContent.trim()) return;

    const now = new Date().toISOString();
    const noteToSave: WorkspaceNote = {
      id: editingNote ? editingNote.id : `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: formTitle.trim() || 'Untitled Note',
      content: formContent.trim(),
      category: formCategory,
      color: formColor,
      isPinned: formPinned,
      createdAt: editingNote ? editingNote.createdAt : now,
      updatedAt: now
    };

    await workspaceDB.saveNote(noteToSave);
    setIsEditorOpen(false);
    loadNotes();
  };

  const handleDeleteNote = async (id: string) => {
    if (window.confirm('Delete this note permanently?')) {
      await workspaceDB.deleteNote(id);
      loadNotes();
    }
  };

  const handleTogglePin = async (note: WorkspaceNote, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...note, isPinned: !note.isPinned, updatedAt: new Date().toISOString() };
    await workspaceDB.saveNote(updated);
    loadNotes();
  };

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === '' ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const otherNotes = filteredNotes.filter((n) => !n.isPinned);

  const getColorClasses = (colorName?: string) => {
    const found = NOTE_COLORS.find((c) => c.name === colorName);
    return found ? `${found.bg} ${found.border}` : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            My Notes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Capture thoughts, meeting notes, project plans, and knowledge locally.
          </p>
        </div>

        <button
          onClick={openNewNoteModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search in notes by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 border border-slate-200 dark:border-slate-700 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
            {searchQuery ? 'No matching notes found' : 'No notes created yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'Try modifying your search keywords or clearing category filters.'
              : 'Write down quick ideas, meeting summaries, or research notes. They save instantly.'}
          </p>
          {!searchQuery && (
            <button
              onClick={openNewNoteModal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Write First Note
            </button>
          )}
        </div>
      )}

      {/* Pinned Notes Grid */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Pin className="w-3.5 h-3.5 text-amber-500" />
            <span>Pinned Notes ({pinnedNotes.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => renderNoteCard(note))}
          </div>
        </div>
      )}

      {/* Other Notes Grid */}
      {otherNotes.length > 0 && (
        <div className="space-y-3">
          {pinnedNotes.length > 0 && (
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>All Notes ({otherNotes.length})</span>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherNotes.map((note) => renderNoteCard(note))}
          </div>
        </div>
      )}

      {/* Note Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-500" />
                {editingNote ? 'Edit Note' : 'Create New Note'}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormPinned(!formPinned)}
                  className={`p-2 rounded-xl transition ${
                    formPinned
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                  title={formPinned ? 'Unpin' : 'Pin to top'}
                >
                  <Pin className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveNote} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <input
                  type="text"
                  placeholder="Note Title..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-lg font-bold border-b border-transparent focus:border-emerald-500 focus:outline-none dark:bg-slate-800 dark:text-white"
                  autoFocus
                />
              </div>

              <div>
                <textarea
                  placeholder="Write your note here..."
                  rows={10}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full p-3 text-sm border rounded-2xl dark:bg-slate-700/50 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-normal leading-relaxed resize-y"
                />
              </div>

              {/* Categorization & Color Palette */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Category Tag
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    Card Accent Color
                  </label>
                  <div className="flex gap-2">
                    {NOTE_COLORS.map((clr) => (
                      <button
                        key={clr.name}
                        type="button"
                        onClick={() => setFormColor(clr.name)}
                        className={`w-7 h-7 rounded-full border transition flex items-center justify-center ${clr.bg} ${
                          formColor === clr.name
                            ? 'ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-800'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                        title={clr.name}
                      >
                        {formColor === clr.name && <Check className="w-3.5 h-3.5 text-slate-700 dark:text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm transition"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  function renderNoteCard(note: WorkspaceNote) {
    const updatedFormatted = new Date(note.updatedAt).toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <div
        key={note.id}
        onClick={() => openEditNoteModal(note)}
        className={`p-5 rounded-2xl border shadow-sm transition hover:shadow-md cursor-pointer flex flex-col justify-between group ${getColorClasses(
          note.color
        )}`}
      >
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
              {note.title}
            </h4>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={(e) => handleTogglePin(note, e)}
                className={`p-1 rounded-lg transition ${
                  note.isPinned
                    ? 'text-amber-500 hover:text-amber-600'
                    : 'text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 hover:text-slate-500'
                }`}
                title={note.isPinned ? 'Unpin' : 'Pin to top'}
              >
                <Pin className="w-3.5 h-3.5 fill-current" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteNote(note.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 rounded-lg transition"
                title="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-4 font-normal leading-relaxed whitespace-pre-line">
            {note.content || <span className="italic text-slate-400">No text content</span>}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400 font-medium">
            {note.category || 'General'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {updatedFormatted}
          </span>
        </div>
      </div>
    );
  }
};
