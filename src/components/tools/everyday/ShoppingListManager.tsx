import React, { useState, useEffect } from 'react';
import { ShoppingBag, Plus, Trash2, CheckSquare, Square, Store, Tag } from 'lucide-react';
import { safeStorage } from '../../../utils/storage';

interface ShoppingItem {
  id: string;
  name: string;
  store: string;
  priority: 'High' | 'Medium' | 'Low';
  quantity: string;
  budget: number;
  purchased: boolean;
}

const STORAGE_KEY = 'lifetools_shopping_manager';

const STORES = ['Supermarket', 'Pharmacy / Chemist', 'Electronics & Tech', 'Hardware & Home', 'Clothing & Apparel'];

const DEFAULT_ITEMS: ShoppingItem[] = [
  { id: '1', name: 'USB-C Fast Charger', store: 'Electronics & Tech', priority: 'High', quantity: '1', budget: 1200, purchased: false },
  { id: '2', name: 'Multivitamins & Zinc', store: 'Pharmacy / Chemist', priority: 'Medium', quantity: '1 Bottle', budget: 450, purchased: true },
  { id: '3', name: 'LED Light Bulbs (9W)', store: 'Hardware & Home', priority: 'Low', quantity: '4 Pack', budget: 350, purchased: false }
];

export const ShoppingListManager: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    return safeStorage.get(STORAGE_KEY, DEFAULT_ITEMS);
  });

  const [selectedStoreFilter, setSelectedStoreFilter] = useState('All');
  const [name, setName] = useState('');
  const [store, setStore] = useState(STORES[0]);
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [quantity, setQuantity] = useState('1');
  const [budget, setBudget] = useState<number | ''>('');
  const [currency, setCurrency] = useState('₹');

  useEffect(() => {
    safeStorage.set(STORAGE_KEY, items);
  }, [items]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: ShoppingItem = {
      id: 'shop_' + Date.now(),
      name: name.trim(),
      store,
      priority,
      quantity: quantity.trim() || '1',
      budget: Number(budget) || 0,
      purchased: false
    };

    setItems(prev => [newItem, ...prev]);
    setName('');
    setQuantity('1');
    setBudget('');
  };

  const togglePurchased = (id: string) => {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, purchased: !i.purchased } : i))
    );
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const filteredItems = selectedStoreFilter === 'All'
    ? items
    : items.filter(i => i.store === selectedStoreFilter);

  const totalBudget = items.reduce((sum, i) => sum + (i.budget || 0), 0);
  const remainingBudget = items
    .filter(i => !i.purchased)
    .reduce((sum, i) => sum + (i.budget || 0), 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <ShoppingBag className="w-3.5 h-3.5" /> Everyday Life Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Multi-Store Shopping List Manager
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Coordinate shopping trips across multiple retail stores with priority tags and budget tracking.
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Items
          </span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
            {items.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across {new Set(items.map(i => i.store)).size} retail categories
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Remaining Spend
          </span>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            {currency} {remainingBudget.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            For unpurchased items
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            High Priority
          </span>
          <div className="text-3xl font-extrabold text-rose-500 mt-1 font-mono">
            {items.filter(i => i.priority === 'High' && !i.purchased).length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Urgent pending items</span>
        </div>
      </div>

      {/* Add Item Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-500" /> Add Shopping Item
        </h2>

        <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-500 mb-1">Item Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. AA Rechargeable Batteries"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Store / Retailer</label>
            <select
              value={store}
              onChange={e => setStore(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {STORES.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Est. Budget ({currency})</label>
            <input
              type="number"
              min={0}
              value={budget}
              onChange={e => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Optional"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-5 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Save Shopping Item
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs & Items List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setSelectedStoreFilter('All')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                selectedStoreFilter === 'All'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All Stores ({items.length})
            </button>
            {STORES.map(s => {
              const count = items.filter(i => i.store === s).length;
              if (count === 0) return null;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedStoreFilter(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedStoreFilter === s
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {s.split('/')[0]} ({count})
                </button>
              );
            })}
          </div>

          {items.length > 0 && (
            <button
              onClick={() => setItems([])}
              className="text-xs text-rose-500 hover:underline"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No items in this store category.
            </div>
          ) : (
            filteredItems.map(item => (
              <div
                key={item.id}
                className={`p-3.5 flex items-center justify-between gap-4 transition-colors ${
                  item.purchased ? 'bg-slate-50/50 dark:bg-slate-800/20 opacity-60' : 'hover:bg-slate-50/50'
                }`}
              >
                <div
                  onClick={() => togglePurchased(item.id)}
                  className="flex items-center gap-3 cursor-pointer flex-1"
                >
                  {item.purchased ? (
                    <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium ${
                          item.purchased
                            ? 'line-through text-slate-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          item.priority === 'High'
                            ? 'bg-rose-500/10 text-rose-500'
                            : item.priority === 'Medium'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-emerald-500/10 text-emerald-500'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {item.store} • Qty: {item.quantity}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {item.budget > 0 && (
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                      {currency} {item.budget}
                    </span>
                  )}
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
