import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, CheckSquare, Square, Download, Share2, Sparkles } from 'lucide-react';
import { safeStorage } from '../../../utils/storage';

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  quantity: string;
  estimatedPrice: number;
  purchased: boolean;
}

const STORAGE_KEY = 'lifetools_grocery_list';

const CATEGORIES = ['Produce (Fruits & Veggies)', 'Dairy & Eggs', 'Pantry & Grains', 'Bakery', 'Beverages', 'Household & Cleaning'];

const DEFAULT_ITEMS: GroceryItem[] = [
  { id: '1', name: 'Almond Milk', category: 'Dairy & Eggs', quantity: '2 Cartons', estimatedPrice: 180, purchased: false },
  { id: '2', name: 'Fresh Spinach', category: 'Produce (Fruits & Veggies)', quantity: '500g', estimatedPrice: 40, purchased: true },
  { id: '3', name: 'Basmati Rice', category: 'Pantry & Grains', quantity: '5 kg', estimatedPrice: 450, purchased: false },
  { id: '4', name: 'Whole Wheat Bread', category: 'Bakery', quantity: '1 Loaf', estimatedPrice: 50, purchased: false }
];

export const GroceryListMaker: React.FC = () => {
  const [items, setItems] = useState<GroceryItem[]>(() => {
    return safeStorage.get(STORAGE_KEY, DEFAULT_ITEMS);
  });

  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState<number | ''>('');
  const [currency, setCurrency] = useState('₹');

  useEffect(() => {
    safeStorage.set(STORAGE_KEY, items);
  }, [items]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: GroceryItem = {
      id: 'groc_' + Date.now(),
      name: name.trim(),
      category,
      quantity: quantity.trim() || '1',
      estimatedPrice: Number(price) || 0,
      purchased: false
    };

    setItems(prev => [...prev, newItem]);
    setName('');
    setQuantity('1');
    setPrice('');
  };

  const togglePurchased = (id: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, purchased: !item.purchased } : item))
    );
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const totalEstimated = items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
  const purchasedCount = items.filter(i => i.purchased).length;

  const handleCopyShoppingText = () => {
    const lines = [
      `🛒 Grocery Checklist (${purchasedCount}/${items.length} bought):`,
      ...items.map(i => `${i.purchased ? '✓' : '☐'} ${i.name} (${i.quantity}) - ${i.category}`)
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    alert('Grocery checklist copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <ShoppingCart className="w-3.5 h-3.5" /> Everyday Life Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Grocery Shopping List Maker
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Organize grocery shopping by supermarket aisle, keep track of estimated costs, and check off items as you shop.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Shopping Progress
          </span>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1 font-mono">
            {purchasedCount} <span className="text-sm font-normal text-slate-400">/ {items.length}</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {items.length > 0 ? `${Math.round((purchasedCount / items.length) * 100)}% completed` : '0%'}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Est. Total Cost
            </span>
            <input
              type="text"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-7 text-center text-xs border border-slate-200 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800"
            />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {currency} {totalEstimated.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Based on estimated prices</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm">
          <button
            onClick={handleCopyShoppingText}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Copy Clean Shopping Text
          </button>
        </div>
      </div>

      {/* Add Item Form */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-500" /> Add Grocery Item
        </h2>

        <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Item Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Greek Yogurt"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Aisle / Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Quantity / Unit</label>
            <input
              type="text"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              placeholder="e.g. 2 Packs, 1 kg"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Est. Price ({currency})</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Optional"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="sm:col-span-2 md:col-span-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add to Grocery List
            </button>
          </div>
        </form>
      </div>

      {/* Categorized List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
            Aisle Breakdown ({items.length} items)
          </h3>
          {items.length > 0 && (
            <button
              onClick={() => setItems([])}
              className="text-xs text-rose-500 hover:underline"
            >
              Clear Entire List
            </button>
          )}
        </div>

        {CATEGORIES.map(cat => {
          const catItems = items.filter(i => i.category === cat);
          if (catItems.length === 0) return null;

          return (
            <div
              key={cat}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>{cat}</span>
                <span className="text-slate-400 font-normal">
                  {catItems.filter(i => i.purchased).length}/{catItems.length} checked
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {catItems.map(item => (
                  <div
                    key={item.id}
                    className={`p-3 flex items-center justify-between gap-4 transition-colors ${
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
                        <span
                          className={`text-sm font-medium ${
                            item.purchased
                              ? 'line-through text-slate-400'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {item.name}
                        </span>
                        <span className="text-xs text-slate-400 ml-2 font-mono">
                          ({item.quantity})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.estimatedPrice > 0 && (
                        <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400">
                          {currency} {item.estimatedPrice}
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
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
