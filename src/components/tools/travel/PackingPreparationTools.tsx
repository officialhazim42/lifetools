import React, { useState, useEffect } from 'react';
import {
  Luggage,
  CheckCircle,
  Plus,
  Trash2,
  Copy,
  Download,
  AlertTriangle,
  Scale,
  Briefcase,
  Sun,
  Snowflake,
  Tent,
  FileText,
  Shield,
  Layers,
  Home
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { travelDB } from '../../../utils/travelDB';
import { PackingItem } from '../../../types/travel';

// ==========================================
// 1. SMART PACKING LIST
// ==========================================
export const SmartPackingList: React.FC = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState<PackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBag, setFilterBag] = useState<string>('all');

  // New item form
  const [name, setName] = useState('');
  const [category, setCategory] = useState<PackingItem['category']>('clothing');
  const [bagType, setBagType] = useState<PackingItem['bagType']>('carry_on');
  const [quantity, setQuantity] = useState(1);
  const [essential, setEssential] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const list = await travelDB.getPackingItems();
      if (list.length === 0) {
        // Seed initial items if empty
        const defaults: PackingItem[] = [
          { id: '1', name: 'Passports & IDs', category: 'documents', quantity: 1, isPacked: false, bagType: 'personal_item', essential: true },
          { id: '2', name: 'Universal Adapter & Charger', category: 'electronics', quantity: 1, isPacked: false, bagType: 'carry_on', essential: true },
          { id: '3', name: 'Comfortable Walking Shoes', category: 'clothing', quantity: 1, isPacked: false, bagType: 'checked', essential: true },
          { id: '4', name: 'Prescription Medications', category: 'health', quantity: 1, isPacked: false, bagType: 'personal_item', essential: true },
          { id: '5', name: 'Toiletry Bag & Toothbrush', category: 'toiletries', quantity: 1, isPacked: false, bagType: 'carry_on', essential: false }
        ];
        for (const item of defaults) {
          await travelDB.savePackingItem(item);
        }
        setItems(defaults);
      } else {
        setItems(list);
      }
    } catch {
      showToast('Could not load packing items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: PackingItem = {
      id: `pack_${Date.now()}`,
      name: name.trim(),
      category,
      bagType,
      quantity: Math.max(1, quantity),
      isPacked: false,
      essential
    };

    await travelDB.savePackingItem(newItem);
    showToast(`Added "${newItem.name}"`, 'success');
    setName('');
    setQuantity(1);
    setEssential(false);
    loadItems();
  };

  const togglePacked = async (item: PackingItem) => {
    const updated = { ...item, isPacked: !item.isPacked };
    await travelDB.savePackingItem(updated);
    loadItems();
  };

  const handleDelete = async (id: string) => {
    await travelDB.deletePackingItem(id);
    loadItems();
  };

  const packedCount = items.filter((i) => i.isPacked).length;
  const progressPercent = items.length > 0 ? Math.round((packedCount / items.length) * 100) : 0;

  const filtered = items.filter((i) => {
    if (filterBag === 'all') return true;
    return i.bagType === filterBag;
  });

  const exportList = () => {
    let out = `SMART PACKING LIST (${packedCount}/${items.length} Packed)\n=====================================\n`;
    const cats = ['documents', 'electronics', 'clothing', 'toiletries', 'health', 'gear', 'miscellaneous'];
    cats.forEach((c) => {
      const catItems = items.filter((i) => i.category === c);
      if (catItems.length > 0) {
        out += `\n[ ${c.toUpperCase()} ]\n`;
        catItems.forEach((i) => {
          out += `${i.isPacked ? '[X]' : '[ ]'} ${i.name} (x${i.quantity}) [${i.bagType.replace('_', ' ')}]${i.essential ? ' *ESSENTIAL*' : ''}\n`;
        });
      }
    });
    navigator.clipboard.writeText(out);
    showToast('Packing list copied to clipboard', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>🧳</span> Smart Packing List
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track packed essentials categorized by luggage type (carry-on, checked, personal item).
          </p>
        </div>
        <button
          onClick={exportList}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition"
        >
          <Copy className="w-3.5 h-3.5" /> Copy List
        </button>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Packing Progress ({packedCount} of {items.length} items packed)
          </span>
          <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { key: 'all', label: 'All Luggage' },
          { key: 'personal_item', label: '🎒 Personal Item' },
          { key: 'carry_on', label: '🧳 Carry-On' },
          { key: 'checked', label: '📦 Checked Bag' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterBag(tab.key)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              filterBag === tab.key
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Item Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-500" /> Add Item
          </h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Item Name *</label>
              <input
                type="text"
                placeholder="e.g. Noise cancelling headphones"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PackingItem['category'])}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="clothing">👕 Clothing</option>
                  <option value="toiletries">🧴 Toiletries</option>
                  <option value="electronics">🔌 Electronics</option>
                  <option value="documents">📄 Documents</option>
                  <option value="health">💊 Health</option>
                  <option value="gear">🎒 Gear</option>
                  <option value="miscellaneous">📦 Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Luggage Bag</label>
                <select
                  value={bagType}
                  onChange={(e) => setBagType(e.target.value as PackingItem['bagType'])}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="personal_item">Personal Item</option>
                  <option value="carry_on">Carry-On</option>
                  <option value="checked">Checked Bag</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-500">Qty:</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                />
              </div>

              <label className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={essential}
                  onChange={(e) => setEssential(e.target.checked)}
                  className="rounded text-amber-600"
                />
                Must-Have
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition shadow-sm mt-2"
            >
              Add to List
            </button>
          </form>
        </div>

        {/* Packing Items List */}
        <div className="lg:col-span-2 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400 text-sm">No items in this luggage view</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                  item.isPacked
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => togglePacked(item)}
                    className="text-slate-400 hover:text-emerald-500 transition"
                  >
                    <CheckCircle
                      className={`w-5 h-5 ${
                        item.isPacked ? 'text-emerald-500 fill-emerald-100 dark:fill-emerald-950' : ''
                      }`}
                    />
                  </button>
                  <div>
                    <span
                      className={`text-sm font-medium ${
                        item.isPacked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="capitalize">{item.category}</span>
                      <span>•</span>
                      <span>Qty: {item.quantity}</span>
                      <span>•</span>
                      <span className="capitalize">{item.bagType.replace('_', ' ')}</span>
                      {item.essential && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600 dark:text-amber-400 font-bold">Must-Have</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. INTERNATIONAL TRAVEL CHECKLIST
// ==========================================
export const InternationalTravelChecklist: React.FC = () => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Passport has at least 6 months validity from return date', checked: false },
    { id: '2', text: 'Destination visa or electronic travel authorization (ETA) approved & printed', checked: false },
    { id: '3', text: 'International roaming enabled or regional eSIM profile saved offline', checked: false },
    { id: '4', text: 'Credit cards notified of international travel; 0% foreign transaction fee cards packed', checked: false },
    { id: '5', text: 'Universal plug adapter & voltage converter (if using 110V appliances in 220V zones)', checked: false },
    { id: '6', text: 'Offline translation dictionary and offline Google Maps downloaded', checked: false },
    { id: '7', text: 'Travel health insurance policy card & emergency assistance phone numbers', checked: false },
    { id: '8', text: 'Emergency small-denomination cash in foreign currency ($100-200 equivalent)', checked: false },
    { id: '9', text: 'Prescription medicines with physician letter and in original labeled containers', checked: false }
  ]);

  const toggle = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t)));
  };

  const copy = () => {
    let out = `INTERNATIONAL TRAVEL CHECKLIST\n==============================\n`;
    tasks.forEach((t) => {
      out += `${t.checked ? '[X]' : '[ ]'} ${t.text}\n`;
    });
    navigator.clipboard.writeText(out);
    showToast('Checklist copied to clipboard', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>🌍</span> International Travel Checklist
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Crucial cross-border verifications including 6-month passport validity, visas, and roaming.
          </p>
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition"
        >
          <Copy className="w-3.5 h-3.5" /> Copy Checklist
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
        {tasks.map((t) => (
          <label
            key={t.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition text-xs border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <input
              type="checkbox"
              checked={t.checked}
              onChange={() => toggle(t.id)}
              className="mt-0.5 rounded text-indigo-600"
            />
            <span
              className={`leading-relaxed ${
                t.checked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200 font-medium'
              }`}
            >
              {t.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 3. BUSINESS TRIP PACKING LIST
// ==========================================
export const BusinessTripPackingList: React.FC = () => {
  const { showToast } = useToast();
  const [items, setItems] = useState([
    { id: '1', text: 'Tailored suit / blazers & wrinkle-free dress shirts', checked: false },
    { id: '2', text: 'Dress shoes & matching belt', checked: false },
    { id: '3', text: 'Laptop, charger & multi-port USB-C / HDMI presentation dongle', checked: false },
    { id: '4', text: 'Physical business cards in a protective case', checked: false },
    { id: '5', text: 'Compact travel garment steamer / wrinkle releaser', checked: false },
    { id: '6', text: 'Noise-canceling headphones for flight productivity', checked: false },
    { id: '7', text: 'Corporate credit card & receipt envelope for expense reports', checked: false },
    { id: '8', text: 'Wireless presentation clicker with spare battery', checked: false }
  ]);

  const toggle = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>💼</span> Business Trip Packing List
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Executive checklist for conference presentations, client meetings, and corporate travel.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
        {items.map((i) => (
          <label
            key={i.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition text-xs"
          >
            <input
              type="checkbox"
              checked={i.checked}
              onChange={() => toggle(i.id)}
              className="mt-0.5 rounded text-indigo-600"
            />
            <span
              className={`leading-relaxed ${
                i.checked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'
              }`}
            >
              {i.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 4. CAMPING CHECKLIST
// ==========================================
export const CampingChecklist: React.FC = () => {
  const [items, setItems] = useState([
    { id: '1', text: 'Tent, rainfly, stakes & ground tarp', checked: false },
    { id: '2', text: 'Sleeping bag (temperature rated) & insulated sleeping pad', checked: false },
    { id: '3', text: 'Headlamp with extra batteries & camp lantern', checked: false },
    { id: '4', text: 'Camp stove, fuel canister, lighter & mess kit', checked: false },
    { id: '5', text: 'Water filter pump / purification tablets & 3L water bladder', checked: false },
    { id: '6', text: 'First aid kit with blister bandages, antiseptic & tweezers', checked: false },
    { id: '7', text: 'Multi-tool pocket knife & duct tape', checked: false },
    { id: '8', text: 'Biodegradable soap & quick-dry pack towel', checked: false },
    { id: '9', text: 'Bear-resistant food canister / bear spray (if in wildlife terrain)', checked: false }
  ]);

  const toggle = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>⛺</span> Camping Checklist
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Field-tested backcountry and campground gear list for outdoor excursions.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
        {items.map((i) => (
          <label
            key={i.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition text-xs"
          >
            <input
              type="checkbox"
              checked={i.checked}
              onChange={() => toggle(i.id)}
              className="mt-0.5 rounded text-indigo-600"
            />
            <span
              className={`leading-relaxed ${
                i.checked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'
              }`}
            >
              {i.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 5. BEACH TRIP CHECKLIST
// ==========================================
export const BeachTripChecklist: React.FC = () => {
  const [items, setItems] = useState([
    { id: '1', text: 'Reef-safe broad-spectrum sunscreen (SPF 50+) & aloe vera gel', checked: false },
    { id: '2', text: 'UV-blocking sunglasses (UV400) & wide-brim sun hat', checked: false },
    { id: '3', text: 'Swimsuits & quick-dry UPF 50+ rash guard', checked: false },
    { id: '4', text: 'Sand-free oversized beach towel or blanket', checked: false },
    { id: '5', text: 'Waterproof phone case pouch with neck lanyard', checked: false },
    { id: '6', text: 'Snorkel mask, fins & water shoes', checked: false },
    { id: '7', text: 'Insulated vacuum water bottle & soft cooler bag', checked: false },
    { id: '8', text: 'Waterproof dry bag for keys and electronics', checked: false }
  ]);

  const toggle = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🏖️</span> Beach Trip Checklist
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sun protection, watersports essentials, and sand-resistant beach day essentials.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
        {items.map((i) => (
          <label
            key={i.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition text-xs"
          >
            <input
              type="checkbox"
              checked={i.checked}
              onChange={() => toggle(i.id)}
              className="mt-0.5 rounded text-indigo-600"
            />
            <span
              className={`leading-relaxed ${
                i.checked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'
              }`}
            >
              {i.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 6. WINTER TRAVEL CHECKLIST
// ==========================================
export const WinterTravelChecklist: React.FC = () => {
  const [items, setItems] = useState([
    { id: '1', text: 'Thermal base layer tops and bottoms (merino wool or fleece)', checked: false },
    { id: '2', text: 'Waterproof and windproof insulated heavy coat / ski jacket', checked: false },
    { id: '3', text: 'Insulated winter snow boots with deep non-slip tread', checked: false },
    { id: '4', text: 'Touchscreen-compatible thermal insulated winter gloves', checked: false },
    { id: '5', text: 'Fleece-lined winter beanie & wool neck gaiter / scarf', checked: false },
    { id: '6', text: 'Chemical disposable hand and foot warmers', checked: false },
    { id: '7', text: 'High-moisture lip balm with SPF & intensive hand cream', checked: false },
    { id: '8', text: 'Heavy wool ski socks (multiple pairs)', checked: false }
  ]);

  const toggle = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>❄️</span> Winter Travel Checklist
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sub-zero layering system, snow footwear, and cold-weather skin protection essentials.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
        {items.map((i) => (
          <label
            key={i.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition text-xs"
          >
            <input
              type="checkbox"
              checked={i.checked}
              onChange={() => toggle(i.id)}
              className="mt-0.5 rounded text-indigo-600"
            />
            <span
              className={`leading-relaxed ${
                i.checked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'
              }`}
            >
              {i.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 7. TRAVEL DOCUMENT CHECKLIST
// ==========================================
export const TravelDocumentChecklist: React.FC = () => {
  const [items, setItems] = useState([
    { id: '1', text: 'Original physical passport with 6 months validity', checked: false },
    { id: '2', text: 'Printed physical copy of passport information page stored separately', checked: false },
    { id: '3', text: 'National ID card and Driver License (plus International Driving Permit if driving)', checked: false },
    { id: '4', text: 'Printed flight e-tickets and boarding passes', checked: false },
    { id: '5', text: 'Printed hotel / accommodation confirmation vouchers', checked: false },
    { id: '6', text: 'Travel health & medical evacuation insurance policy document', checked: false },
    { id: '7', text: 'Car rental reservation voucher & credit card used for booking', checked: false },
    { id: '8', text: 'Digital backup copies saved in encrypted offline phone folder', checked: false }
  ]);

  const toggle = (id: string) => {
    setItems(items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>📄</span> Travel Document Checklist
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Ensure physical and digital duplicates of identification, insurance, and booking vouchers.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
        {items.map((i) => (
          <label
            key={i.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition text-xs"
          >
            <input
              type="checkbox"
              checked={i.checked}
              onChange={() => toggle(i.id)}
              className="mt-0.5 rounded text-indigo-600"
            />
            <span
              className={`leading-relaxed ${
                i.checked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'
              }`}
            >
              {i.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 8. LUGGAGE ORGANIZER
// ==========================================
export const LuggageOrganizer: React.FC = () => {
  const [cubes, setCubes] = useState([
    { id: '1', name: 'Packing Cube 1 (Large)', contents: 'Shirts, sweaters, pants, dresses' },
    { id: '2', name: 'Packing Cube 2 (Medium)', contents: 'Underwear, socks, sleepwear, activewear' },
    { id: '3', name: 'Toiletry Dopp Kit', contents: 'Shampoo bar, toothpaste, skincare, razor' },
    { id: '4', name: 'Tech Cable Organizer Pouch', contents: 'Chargers, USB cables, power bank, SD cards' },
    { id: '5', name: 'Shoe Bag', contents: 'Spare sneakers & dress flats in dust bags' },
    { id: '6', name: 'Laundry Compression Sack', contents: 'Used clothing isolated from clean garments' }
  ]);

  const updateContent = (idx: number, val: string) => {
    const copy = [...cubes];
    copy[idx].contents = val;
    setCubes(copy);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>📦</span> Luggage Organizer
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Designate packing cubes and compartments so you never have to unpack your entire suitcase in transit.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cubes.map((c, idx) => (
          <div
            key={c.id}
            className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 shadow-sm"
          >
            <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {c.name}
            </h4>
            <textarea
              rows={2}
              value={c.contents}
              onChange={(e) => updateContent(idx, e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-700 dark:text-slate-200"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 9. BAGGAGE WEIGHT TRACKER
// ==========================================
export const BaggageWeightTracker: React.FC = () => {
  const { showToast } = useToast();
  const [maxLimitKg, setMaxLimitKg] = useState(23); // standard checked bag limit
  const [bagItems, setBagItems] = useState([
    { id: '1', name: 'Suitcase Base Weight (empty)', weightKg: 3.8 },
    { id: '2', name: 'Clothing (Cubes 1 & 2)', weightKg: 6.5 },
    { id: '3', name: 'Shoes (2 pairs)', weightKg: 2.2 },
    { id: '4', name: 'Toiletry Bag & Liquids', weightKg: 1.8 },
    { id: '5', name: 'Books & Paperwork', weightKg: 1.0 },
    { id: '6', name: 'Souvenirs & Gifts', weightKg: 2.5 }
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemWeight, setNewItemWeight] = useState(1.0);

  const totalWeight = bagItems.reduce((acc, i) => acc + i.weightKg, 0);
  const remainingAllowance = maxLimitKg - totalWeight;
  const isOverweight = remainingAllowance < 0;

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setBagItems([
      ...bagItems,
      { id: `item_${Date.now()}`, name: newItemName.trim(), weightKg: Math.max(0.1, newItemWeight) }
    ]);
    setNewItemName('');
    setNewItemWeight(1.0);
    showToast('Item weight recorded', 'info');
  };

  const removeItem = (id: string) => {
    setBagItems(bagItems.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>⚖️</span> Baggage Weight Tracker
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Tally item weights to prevent costly airport counter overweight excess baggage fees.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">Max Allowance</span>
          <div className="flex items-center justify-center gap-1 mt-1">
            <input
              type="number"
              value={maxLimitKg}
              onChange={(e) => setMaxLimitKg(parseFloat(e.target.value) || 20)}
              className="w-16 text-center font-bold text-lg rounded border border-slate-200 dark:border-slate-700 dark:bg-slate-900"
            />
            <span className="text-xs font-semibold">kg</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">Current Weight</span>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {totalWeight.toFixed(1)} kg
          </p>
          <span className="text-[10px] text-slate-400">({(totalWeight * 2.20462).toFixed(1)} lbs)</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
          <span className="text-xs text-slate-500">{isOverweight ? 'Over Limit!' : 'Remaining'}</span>
          <p
            className={`text-xl font-bold mt-1 ${
              isOverweight ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {isOverweight ? `+${Math.abs(remainingAllowance).toFixed(1)} kg` : `${remainingAllowance.toFixed(1)} kg`}
          </p>
        </div>
      </div>

      {isOverweight && (
        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-300 text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>
            <strong>Baggage exceeds airline limit by {Math.abs(remainingAllowance).toFixed(1)} kg!</strong> Shift heavy items to your carry-on or personal bag to avoid overweight fees.
          </span>
        </div>
      )}

      <form onSubmit={addItem} className="flex gap-2 bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
        <input
          type="text"
          placeholder="Item name (e.g. Winter boots)"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
        />
        <input
          type="number"
          step="0.1"
          min="0.1"
          placeholder="kg"
          value={newItemWeight}
          onChange={(e) => setNewItemWeight(parseFloat(e.target.value) || 0.5)}
          className="w-20 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
        >
          Add Item
        </button>
      </form>

      <div className="space-y-2">
        {bagItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs"
          >
            <span className="font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
            <div className="flex items-center gap-3">
              <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{item.weightKg} kg</span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 10. PRE-DEPARTURE CHECKLIST
// ==========================================
export const PreDepartureChecklist: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Shut off main water valve / verify all faucets and hoses are off', checked: false },
    { id: '2', text: 'Adjust smart thermostat to vacation / eco mode', checked: false },
    { id: '3', text: 'Unplug non-essential electronics and power strips (reduce phantom load)', checked: false },
    { id: '4', text: 'Empty kitchen refrigerator of perishable foods and clean sink drain', checked: false },
    { id: '5', text: 'Take out all garbage, recycling, and compost bins', checked: false },
    { id: '6', text: 'Ensure all windows, sliding doors, and security deadbolts are locked', checked: false },
    { id: '7', text: 'Pause postal mail / newspaper delivery or notify trusted neighbor', checked: false },
    { id: '8', text: 'Set lighting timers or smart lights to automated vacation schedule', checked: false },
    { id: '9', text: 'Turn off interior water heater or switch to vacation setting', checked: false }
  ]);

  const toggle = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <span>🏠</span> Pre-Departure Checklist
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Home security, plumbing, electrical shutoffs, and departure morning household walk-through.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
        {tasks.map((t) => (
          <label
            key={t.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/40 cursor-pointer transition text-xs"
          >
            <input
              type="checkbox"
              checked={t.checked}
              onChange={() => toggle(t.id)}
              className="mt-0.5 rounded text-indigo-600"
            />
            <span
              className={`leading-relaxed ${
                t.checked ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'
              }`}
            >
              {t.text}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
