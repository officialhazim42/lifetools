import React, { useState, useEffect } from 'react';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate?: string;
  createdAt: number;
}

const STORAGE_KEY = 'lifetools_todos';

export const TodoList: React.FC = () => {
  const { showToast } = useToast();
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    return storage.get<TodoItem[]>(STORAGE_KEY, []);
  });

  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newCategory, setNewCategory] = useState('Personal');
  const [newDueDate, setNewDueDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  useEffect(() => {
    storage.set(STORAGE_KEY, todos);
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Please enter a task title', 'warning');
      return;
    }

    const newItem: TodoItem = {
      id: 'todo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: newTitle.trim(),
      completed: false,
      priority: newPriority,
      category: newCategory.trim() || 'General',
      dueDate: newDueDate || undefined,
      createdAt: Date.now()
    };

    setTodos(prev => [newItem, ...prev]);
    setNewTitle('');
    setNewDueDate('');
    showToast('Task added successfully!');
  };

  const handleToggle = (id: string) => {
    setTodos(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDelete = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    showToast('Task removed', 'info');
  };

  const handleClearCompleted = () => {
    const completedCount = todos.filter(t => t.completed).length;
    if (completedCount === 0) return;
    setTodos(prev => prev.filter(t => !t.completed));
    showToast(`Cleared ${completedCount} completed tasks`);
  };

  const handleExportJson = () => {
    storage.exportToJson('lifetools-todos.json', todos);
    showToast('Exported tasks as JSON');
  };

  const handleExportCsv = () => {
    const headers = ['Title', 'Status', 'Priority', 'Category', 'Due Date', 'Created At'];
    const rows = todos.map(t => [
      t.title,
      t.completed ? 'Completed' : 'Pending',
      t.priority,
      t.category,
      t.dueDate || '',
      new Date(t.createdAt).toLocaleDateString()
    ]);
    storage.exportToCsv('lifetools-todos.csv', headers, rows);
    showToast('Exported tasks as CSV');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setTodos(imported);
          showToast(`Imported ${imported.length} tasks!`);
        } else {
          showToast('Invalid JSON file format', 'error');
        }
      } catch {
        showToast('Error reading JSON file', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredTodos = todos.filter(t => {
    if (filterStatus === 'active' && t.completed) return false;
    if (filterStatus === 'completed' && !t.completed) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCount = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress & Stats Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-500" /> My Tasks
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {completedCount} of {totalCount} tasks completed ({progressPercent}%)
          </p>
        </div>

        <div className="w-full sm:w-48 bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-200 dark:border-slate-700">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleExportCsv} className="btn-secondary text-xs py-1.5" title="Export as CSV">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button onClick={handleExportJson} className="btn-secondary text-xs py-1.5" title="Export as JSON">
            <Download className="w-3.5 h-3.5" /> JSON
          </button>
          <label className="btn-secondary text-xs py-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" /> Import
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>
        </div>
      </div>

      {/* Task Creation Form */}
      <form onSubmit={handleAddTodo} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="input-base"
            />
          </div>
          <div className="sm:col-span-2">
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as any)}
              className="input-base"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="input-base text-xs"
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary w-full h-[42px]">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>
      </form>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-base pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-100 dark:bg-slate-900 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-md transition-colors ${filterStatus === 'all' ? 'bg-white dark:bg-slate-800 font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              All ({todos.length})
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-3 py-1 rounded-md transition-colors ${filterStatus === 'active' ? 'bg-white dark:bg-slate-800 font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Active ({todos.filter(t => !t.completed).length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1 rounded-md transition-colors ${filterStatus === 'completed' ? 'bg-white dark:bg-slate-800 font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400'}`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {completedCount > 0 && (
            <button onClick={handleClearCompleted} className="btn-secondary text-xs py-1 text-rose-500 hover:text-rose-600">
              Clear Completed
            </button>
          )}
        </div>
      </div>

      {/* Todo List Items */}
      <div className="space-y-2">
        {filteredTodos.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <CheckCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No tasks found</p>
            <p className="text-xs text-slate-400">Add a new task above to get organized.</p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                todo.completed
                  ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/50 opacity-70'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  onClick={() => handleToggle(todo.id)}
                  className="text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                >
                  {todo.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <span
                    className={`text-sm font-medium block truncate ${
                      todo.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {todo.title}
                  </span>
                  <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px] text-slate-400">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        todo.priority === 'high'
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                          : todo.priority === 'medium'
                          ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {todo.priority}
                    </span>
                    {todo.dueDate && (
                      <span>Due: {new Date(todo.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(todo.id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
