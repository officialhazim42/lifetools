import React, { useState, useEffect } from 'react';
import { Luggage, CheckSquare, Square, Plus, Trash2, RotateCcw, Share2, Sparkles } from 'lucide-react';
import { safeStorage } from '../../../utils/storage';

interface PackingItem {
  id: string;
  name: string;
  category: string;
  packed: boolean;
}

const STORAGE_KEY = 'lifetools_packing_list';

export const PackingListGenerator: React.FC = () => {
  const [tripType, setTripType] = useState<'casual' | 'business' | 'beach' | 'camping'>('casual');
  const [climate, setClimate] = useState<'warm' | 'cold' | 'rainy'>('warm');
  const [durationDays, setDurationDays] = useState(5);

  const generateDefaultItems = (): PackingItem[] => {
    const list: { name: string; category: string }[] = [
      // Documents
      { name: 'Passport / National ID & Copies', category: 'Documents & Wallet' },
      { name: 'Flight / Train Tickets & Boarding Passes', category: 'Documents & Wallet' },
      { name: 'Hotel / Airbnb Booking Confirmations', category: 'Documents & Wallet' },
      { name: 'Credit / Debit Cards & Local Cash', category: 'Documents & Wallet' },

      // Electronics
      { name: 'Smartphone & USB-C / Lightning Cable', category: 'Electronics' },
      { name: 'Portable Power Bank (10,000+ mAh)', category: 'Electronics' },
      { name: 'Universal Travel Plug Adapter', category: 'Electronics' },
      { name: 'Noise-Cancelling Earbuds / Headphones', category: 'Electronics' },

      // Toiletries
      { name: 'Toothbrush & Travel Toothpaste', category: 'Toiletries' },
      { name: 'Deodorant / Fragrance', category: 'Toiletries' },
      { name: 'Sunscreen SPF 50+', category: 'Toiletries' },
      { name: 'Personal Medications & Painkillers', category: 'Toiletries' }
    ];

    // Clothes based on days
    const shirts = Math.min(durationDays + 1, 10);
    const socks = Math.min(durationDays + 1, 10);
    list.push({ name: `${shirts}x Daily Shirts / T-Shirts`, category: 'Clothing' });
    list.push({ name: `${socks}x Pairs of Socks & Underwear`, category: 'Clothing' });
    list.push({ name: 'Comfortable Walking Shoes', category: 'Clothing' });

    // Climate additions
    if (climate === 'cold') {
      list.push({ name: 'Thermal Base Layer (Top & Bottom)', category: 'Clothing' });
      list.push({ name: 'Heavy Insulated Winter Jacket', category: 'Clothing' });
      list.push({ name: 'Beanie / Wool Hat & Gloves', category: 'Clothing' });
      list.push({ name: 'Lip Balm & Moisturizer', category: 'Toiletries' });
    } else if (climate === 'rainy') {
      list.push({ name: 'Compact Umbrella', category: 'Miscellaneous' });
      list.push({ name: 'Waterproof Rain Poncho / Jacket', category: 'Clothing' });
      list.push({ name: 'Waterproof Dry Bag / Zip Pouches', category: 'Miscellaneous' });
    } else {
      list.push({ name: 'UV Sunglasses', category: 'Miscellaneous' });
      list.push({ name: 'Sun Hat / Baseball Cap', category: 'Clothing' });
    }

    // Trip type additions
    if (tripType === 'business') {
      list.push({ name: 'Laptop, Charger & HDMI Dongle', category: 'Electronics' });
      list.push({ name: 'Business Suits / Formal Blazers', category: 'Clothing' });
      list.push({ name: 'Dress Shoes & Belt', category: 'Clothing' });
    } else if (tripType === 'beach') {
      list.push({ name: '2x Swimsuits / Boardshorts', category: 'Clothing' });
      list.push({ name: 'Microfiber Quick-Dry Beach Towel', category: 'Miscellaneous' });
      list.push({ name: 'Flip Flops / Sandals', category: 'Clothing' });
    } else if (tripType === 'camping') {
      list.push({ name: 'Flashlight / Headlamp + Extra Batteries', category: 'Miscellaneous' });
      list.push({ name: 'Insect Repellent Spray', category: 'Toiletries' });
      list.push({ name: 'First Aid Kit & Blister Pads', category: 'Toiletries' });
    }

    return list.map((item, idx) => ({
      id: `pack_${idx}_${Date.now()}`,
      name: item.name,
      category: item.category,
      packed: false
    }));
  };

  const [items, setItems] = useState<PackingItem[]>(() => {
    return safeStorage.get(STORAGE_KEY, generateDefaultItems());
  });

  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState('Clothing');

  useEffect(() => {
    safeStorage.set(STORAGE_KEY, items);
  }, [items]);

  const togglePacked = (id: string) => {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, packed: !i.packed } : i))
    );
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleRegenerate = () => {
    setItems(generateDefaultItems());
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setItems(prev => [
      ...prev,
      {
        id: 'pack_custom_' + Date.now(),
        name: newItemName.trim(),
        category: newItemCat,
        packed: false
      }
    ]);
    setNewItemName('');
  };

  const packedCount = items.filter(i => i.packed).length;
  const progressPercent = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  const categories = Array.from(new Set(items.map(i => i.category)));

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
          <Luggage className="w-3.5 h-3.5" /> Everyday Life Utility
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Smart Travel Packing List Generator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
          Generate an intelligent, customized travel checklist tailored to your destination weather, trip length, and activities.
        </p>
      </div>

      {/* Generator Controls Card */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" /> Trip Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Trip Style</label>
            <select
              value={tripType}
              onChange={e => setTripType(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="casual">Casual / City Vacation</option>
              <option value="business">Business / Conference</option>
              <option value="beach">Beach / Resort / Tropical</option>
              <option value="camping">Camping / Trekking / Outdoors</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Expected Climate</label>
            <select
              value={climate}
              onChange={e => setClimate(e.target.value as any)}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="warm">Warm / Summer (20°C - 35°C)</option>
              <option value="cold">Cold / Winter (&lt; 10°C / Snow)</option>
              <option value="rainy">Rainy / Monsoon / Humid</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Trip Duration</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={60}
                value={durationDays}
                onChange={e => setDurationDays(Math.max(1, Number(e.target.value)))}
                className="w-24 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <span className="text-xs text-slate-500 font-medium">Days</span>
              <button
                onClick={handleRegenerate}
                className="ml-auto px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Regenerate
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs mb-1.5 font-semibold text-slate-600 dark:text-slate-400">
            <span>Luggage Packed: {packedCount} of {items.length} items</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Custom Item */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            required
            value={newItemName}
            onChange={e => setNewItemName(e.target.value)}
            placeholder="Add specific item to pack..."
            className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full"
          />

          <select
            value={newItemCat}
            onChange={e => setNewItemCat(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="Clothing">Clothing</option>
            <option value="Toiletries">Toiletries</option>
            <option value="Electronics">Electronics</option>
            <option value="Documents & Wallet">Documents & Wallet</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1 shadow-sm shrink-0 w-full sm:w-auto justify-center"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </form>
      </div>

      {/* Categorized Checklists */}
      <div className="space-y-4">
        {categories.map(cat => {
          const catItems = items.filter(i => i.category === cat);
          if (catItems.length === 0) return null;

          return (
            <div
              key={cat}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
            >
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>{cat}</span>
                <span className="text-slate-400 font-normal">
                  {catItems.filter(i => i.packed).length}/{catItems.length} packed
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {catItems.map(item => (
                  <div
                    key={item.id}
                    className={`p-3 flex items-center justify-between gap-4 transition-colors ${
                      item.packed ? 'bg-slate-50/50 dark:bg-slate-800/20 opacity-60' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <div
                      onClick={() => togglePacked(item.id)}
                      className="flex items-center gap-3 cursor-pointer flex-1"
                    >
                      {item.packed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          item.packed
                            ? 'line-through text-slate-400'
                            : 'text-slate-900 dark:text-white font-medium'
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
