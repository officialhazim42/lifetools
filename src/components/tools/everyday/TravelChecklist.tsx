import React, { useState, useEffect } from 'react';
import { safeStorage } from '../../../utils/storage';
import {
  Luggage,
  CheckCircle,
  Circle,
  Plus,
  Trash2,
  RotateCcw,
  Download,
  Share2,
  FileCheck,
  Palmtree,
  Briefcase,
  Mountain,
  Snowflake,
  Plane
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  name: string;
  checked: boolean;
}

const PRESETS: Record<string, { name: string; items: Omit<ChecklistItem, 'id' | 'checked'>[] }> = {
  general: {
    name: 'General Holiday / Vacation',
    items: [
      // Documents
      { category: 'Documents & Money', name: 'Passport / National ID / Driving License' },
      { category: 'Documents & Money', name: 'Flight / Train / Bus tickets' },
      { category: 'Documents & Money', name: 'Hotel & Booking confirmations' },
      { category: 'Documents & Money', name: 'Debit / Credit cards & Local cash' },
      { category: 'Documents & Money', name: 'Travel insurance copy' },

      // Electronics
      { category: 'Electronics', name: 'Smartphone & Charger cable' },
      { category: 'Electronics', name: 'High-capacity Power bank (10,000mAh+)' },
      { category: 'Electronics', name: 'Universal travel plug adapter' },
      { category: 'Electronics', name: 'Headphones / Earbuds' },

      // Clothing
      { category: 'Clothing & Footwear', name: 'Daily outfits / T-shirts & Shirts' },
      { category: 'Clothing & Footwear', name: 'Pants / Jeans / Shorts' },
      { category: 'Clothing & Footwear', name: 'Undergarments & Socks (extra pairs)' },
      { category: 'Clothing & Footwear', name: 'Nightwear / Pajamas' },
      { category: 'Clothing & Footwear', name: 'Comfortable walking shoes & slippers' },

      // Toiletries & Meds
      { category: 'Toiletries & Health', name: 'Toothbrush, toothpaste & floss' },
      { category: 'Toiletries & Health', name: 'Shampoo, body wash & deodorant' },
      { category: 'Toiletries & Health', name: 'Prescription medications & pain relievers' },
      { category: 'Toiletries & Health', name: 'Sunscreen (SPF 50+) & moisturizer' },
      { category: 'Toiletries & Health', name: 'Band-aids & antiseptic wipes' },

      // Home Preparation
      { category: 'Home Preparation Before Leaving', name: 'Turn off gas valve & cylinder' },
      { category: 'Home Preparation Before Leaving', name: 'Unplug non-essential electronic appliances' },
      { category: 'Home Preparation Before Leaving', name: 'Empty all kitchen & bathroom dustbins' },
      { category: 'Home Preparation Before Leaving', name: 'Lock all windows, balcony & main doors' },
      { category: 'Home Preparation Before Leaving', name: 'Water plants & set automatic timers' },
    ]
  },
  business: {
    name: 'Business Trip',
    items: [
      { category: 'Documents & Money', name: 'Passport / ID & Corporate ID card' },
      { category: 'Documents & Money', name: 'Meeting agenda, notes & presentation slides' },
      { category: 'Documents & Money', name: 'Corporate credit card & expense receipts folder' },
      { category: 'Electronics', name: 'Work Laptop & power brick' },
      { category: 'Electronics', name: 'Presentation clicker & HDMI adapter' },
      { category: 'Electronics', name: 'Noise-cancelling headphones' },
      { category: 'Electronics', name: 'Mobile phone & power bank' },
      { category: 'Clothing & Footwear', name: 'Formal suits / blazers / formal shirts' },
      { category: 'Clothing & Footwear', name: 'Formal trousers & belt' },
      { category: 'Clothing & Footwear', name: 'Polished formal shoes & dress socks' },
      { category: 'Clothing & Footwear', name: 'Casual change of clothes' },
      { category: 'Toiletries & Health', name: 'Grooming kit, razor & shaving cream' },
      { category: 'Toiletries & Health', name: 'Breath mints & essential medicine' },
      { category: 'Home Preparation Before Leaving', name: 'Set out-of-office email auto-reply' },
      { category: 'Home Preparation Before Leaving', name: 'Lock all home entrances' },
    ]
  },
  beach: {
    name: 'Beach & Coastal Trip',
    items: [
      { category: 'Documents & Money', name: 'ID proofs & Waterproof cash pouch' },
      { category: 'Clothing & Footwear', name: 'Swimsuits / Swim trunks (2 pairs)' },
      { category: 'Clothing & Footwear', name: 'Breathable linen shirts & light shorts' },
      { category: 'Clothing & Footwear', name: 'Flip-flops / Water shoes' },
      { category: 'Clothing & Footwear', name: 'Wide-brim sun hat & UV Sunglasses' },
      { category: 'Toiletries & Health', name: 'High SPF waterproof sunscreen' },
      { category: 'Toiletries & Health', name: 'Aloe vera gel / After-sun lotion' },
      { category: 'Toiletries & Health', name: 'Lip balm with SPF' },
      { category: 'Electronics & Gear', name: 'Waterproof phone pouch / case' },
      { category: 'Electronics & Gear', name: 'Quick-dry microfiber beach towel' },
      { category: 'Electronics & Gear', name: 'Portable waterproof Bluetooth speaker' },
      { category: 'Home Preparation Before Leaving', name: 'Lock up house & turn off main water inlet' },
    ]
  },
  hiking: {
    name: 'Hiking & Trekking',
    items: [
      { category: 'Documents & Money', name: 'Permits, Trail passes & Government ID' },
      { category: 'Clothing & Footwear', name: 'Trekking boots with good ankle support' },
      { category: 'Clothing & Footwear', name: 'Moisture-wicking base layers' },
      { category: 'Clothing & Footwear', name: 'Waterproof rain jacket / Poncho' },
      { category: 'Clothing & Footwear', name: 'Merino wool hiking socks' },
      { category: 'Gear & Navigation', name: 'Hydration bladder / Sturdy water bottle' },
      { category: 'Gear & Navigation', name: 'High-lumen Headlamp & extra batteries' },
      { category: 'Gear & Navigation', name: 'Trekking poles' },
      { category: 'Gear & Navigation', name: 'Offline maps downloaded on phone' },
      { category: 'Gear & Navigation', name: 'Pocket knife / Multi-tool' },
      { category: 'Health & Safety', name: 'Comprehensive First Aid Kit (blister pads, crepe)' },
      { category: 'Health & Safety', name: 'Electrolyte packets & High-calorie trail mix' },
      { category: 'Home Preparation Before Leaving', name: 'Share emergency trail itinerary with family' },
    ]
  }
};

export const TravelChecklist: React.FC = () => {
  const [currentPreset, setCurrentPreset] = useState<string>('general');
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const saved = safeStorage.getItem<ChecklistItem[]>('travel_checklist_items', []);
    if (saved.length > 0) return saved;

    return PRESETS.general.items.map((item, idx) => ({
      ...item,
      id: `item-${Date.now()}-${idx}`,
      checked: false
    }));
  });

  const [filter, setFilter] = useState<'all' | 'unpacked' | 'packed'>('all');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Documents & Money');

  useEffect(() => {
    safeStorage.setItem('travel_checklist_items', items);
  }, [items]);

  const loadPreset = (presetKey: string) => {
    if (
      items.length > 0 &&
      !window.confirm(`Load "${PRESETS[presetKey].name}" checklist? Your current customized list will be replaced.`)
    ) {
      return;
    }
    setCurrentPreset(presetKey);
    const preset = PRESETS[presetKey];
    const newItems = preset.items.map((item, idx) => ({
      ...item,
      id: `item-${Date.now()}-${idx}`,
      checked: false
    }));
    setItems(newItems);
  };

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      category: newItemCategory,
      name: newItemName.trim(),
      checked: false
    };

    setItems((prev) => [...prev, newItem]);
    setNewItemName('');
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleCheckAll = (checked: boolean) => {
    setItems((prev) => prev.map((i) => ({ ...i, checked })));
  };

  const handleExportText = () => {
    const categories = Array.from(new Set(items.map((i) => i.category)));
    let text = `🎒 TRAVEL PACKING CHECKLIST\n`;
    text += `Generated by LifeTools\n`;
    text += `Total: ${items.length} | Packed: ${items.filter((i) => i.checked).length}\n\n`;

    categories.forEach((cat) => {
      text += `=== ${cat.toUpperCase()} ===\n`;
      items
        .filter((i) => i.category === cat)
        .forEach((i) => {
          text += `[${i.checked ? 'X' : ' '}] ${i.name}\n`;
        });
      text += `\n`;
    });

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `travel-checklist-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Stats
  const totalCount = items.length;
  const packedCount = items.filter((i) => i.checked).length;
  const percentage = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  // Categories list
  const existingCategories = Array.from(new Set(items.map((i) => i.category)));

  const filteredItems = items.filter((i) => {
    if (filter === 'packed') return i.checked;
    if (filter === 'unpacked') return !i.checked;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Luggage className="w-8 h-8 text-teal-200" />
            <h1 className="text-2xl md:text-3xl font-bold">Travel & Packing Checklist</h1>
          </div>
          <p className="text-blue-100 text-sm mt-1">
            Never forget your passport, chargers, meds, or home safety tasks before you depart.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportText}
            className="px-3.5 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
            title="Download printable text list"
          >
            <Download className="w-4 h-4" />
            <span>Export Text</span>
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Trip Presets:
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'general', label: 'Vacation', icon: Plane },
            { key: 'business', label: 'Business', icon: Briefcase },
            { key: 'beach', label: 'Beach', icon: Palmtree },
            { key: 'hiking', label: 'Trekking', icon: Mountain },
          ].map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.key}
                onClick={() => loadPreset(preset.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                  currentPreset === preset.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress & Controls */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {packedCount} of {totalCount} items packed
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {percentage === 100 ? '🎉 Everything packed and ready for departure!' : `${totalCount - packedCount} items remaining`}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCheckAll(true)}
              className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 rounded-lg hover:bg-emerald-100 transition"
            >
              Pack All
            </button>
            <button
              onClick={() => handleCheckAll(false)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition"
            >
              Unpack All
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          {(['all', 'unpacked', 'packed'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1 text-xs font-medium rounded-lg capitalize transition ${
                filter === mode
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {mode} ({mode === 'all' ? totalCount : mode === 'packed' ? packedCount : totalCount - packedCount})
            </button>
          ))}
        </div>
      </div>

      {/* Add Custom Item */}
      <form
        onSubmit={handleAddItem}
        className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row gap-3"
      >
        <div className="flex-1">
          <input
            type="text"
            placeholder="Add new travel item (e.g. Travel pillow, Extra memory card)..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
        </div>
        <div className="w-full sm:w-52">
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="w-full px-3 py-2 text-sm border rounded-xl dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          >
            {existingCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="Miscellaneous & Extras">Miscellaneous & Extras</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={!newItemName.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>

      {/* Categorized Checklist */}
      <div className="space-y-4">
        {existingCategories.map((category) => {
          const catItems = filteredItems.filter((i) => i.category === category);
          if (catItems.length === 0) return null;

          const catPacked = catItems.filter((i) => i.checked).length;

          return (
            <div
              key={category}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
            >
              <div className="p-3.5 bg-slate-50 dark:bg-slate-700/40 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                  {category}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {catPacked} / {catItems.length} packed
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition select-none ${
                      item.checked
                        ? 'bg-blue-50/40 dark:bg-blue-950/20 text-slate-400'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.checked ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          item.checked
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="text-slate-300 hover:text-red-500 p-1 rounded-lg transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
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
