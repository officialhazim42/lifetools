import React, { useState } from 'react';
import { formatNumber } from '../../../utils/formatters';
import { storage } from '../../../utils/storage';
import { useToast } from '../../../context/ToastContext';
import {
  ShoppingCart,
  Plus,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Tag,
  Check
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  discountPercent: number;
  taxPercent: number;
}

const CURRENCY_KEY = 'lifetools_pref_currency';

export const ShoppingBudgetCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [currency] = useState(() => storage.get<string>(CURRENCY_KEY, '₹'));
  const [budgetLimit, setBudgetLimit] = useState<number>(5000);
  const [items, setItems] = useState<CartItem[]>([
    { id: 'c1', name: 'Sneakers / Running Shoes', unitPrice: 2499, quantity: 1, discountPercent: 10, taxPercent: 12 },
    { id: 'c2', name: 'Cotton T-Shirt (2-Pack)', unitPrice: 799, quantity: 2, discountPercent: 0, taxPercent: 5 }
  ]);

  const [name, setName] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [discountPercent, setDiscountPercent] = useState('0');
  const [taxPercent, setTaxPercent] = useState('0');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(unitPrice);
    const qty = parseInt(quantity) || 1;
    if (!name.trim()) {
      showToast('Enter item name', 'warning');
      return;
    }
    if (isNaN(price) || price <= 0) {
      showToast('Enter valid unit price', 'warning');
      return;
    }

    const newItem: CartItem = {
      id: 'item_' + Date.now(),
      name: name.trim(),
      unitPrice: price,
      quantity: Math.max(1, qty),
      discountPercent: Math.max(0, Math.min(100, parseFloat(discountPercent) || 0)),
      taxPercent: Math.max(0, parseFloat(taxPercent) || 0)
    };

    setItems(prev => [...prev, newItem]);
    setName('');
    setUnitPrice('');
    setQuantity('1');
    setDiscountPercent('0');
    setTaxPercent('0');
    showToast('Item added to cart');
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleReset = () => {
    setItems([]);
    showToast('Cart cleared', 'info');
  };

  // Calculations
  const calculateItemTotal = (item: CartItem) => {
    const rawSubtotal = item.unitPrice * item.quantity;
    const discountAmt = rawSubtotal * (item.discountPercent / 100);
    const afterDiscount = rawSubtotal - discountAmt;
    const taxAmt = afterDiscount * (item.taxPercent / 100);
    return {
      rawSubtotal,
      discountAmt,
      taxAmt,
      finalTotal: afterDiscount + taxAmt
    };
  };

  let grandSubtotal = 0;
  let totalDiscounts = 0;
  let totalTaxes = 0;
  let grandTotal = 0;

  items.forEach(item => {
    const t = calculateItemTotal(item);
    grandSubtotal += t.rawSubtotal;
    totalDiscounts += t.discountAmt;
    totalTaxes += t.taxAmt;
    grandTotal += t.finalTotal;
  });

  const remainingBudget = budgetLimit - grandTotal;
  const isOverBudget = remainingBudget < 0;

  return (
    <div className="space-y-6">
      {/* Budget Meter Card */}
      <div className={`p-6 rounded-2xl border shadow-subtle transition-all ${
        isOverBudget
          ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-500" /> Shopping Cart Budget Calculator
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Target Budget Limit:</span>
              <input
                type="number"
                min="0"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(Math.max(0, parseFloat(e.target.value) || 0))}
                className="input-base text-xs py-1 px-2.5 w-28 font-bold font-mono"
              />
            </div>
          </div>

          <div className="text-right">
            <div className={`text-3xl font-black font-mono ${isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {currency} {formatNumber(grandTotal, 2)}
            </div>
            <div className="text-xs text-slate-400">
              {isOverBudget ? (
                <span className="text-rose-500 font-bold flex items-center gap-1 justify-end">
                  <AlertTriangle className="w-3.5 h-3.5" /> Over budget by {currency} {formatNumber(Math.abs(remainingBudget), 2)}
                </span>
              ) : (
                <span>{currency} {formatNumber(remainingBudget, 2)} remaining budget</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-4">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Item Name</label>
          <input
            type="text"
            placeholder="e.g. Headphones, Jacket, Groceries"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-base text-xs"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Price ({currency})</label>
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            className="input-base text-xs font-mono"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Qty</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="input-base text-xs font-mono"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Discount %</label>
          <input
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            className="input-base text-xs font-mono"
          />
        </div>

        <div className="sm:col-span-2 flex items-end">
          <button type="submit" className="btn-primary w-full text-xs py-2.5">
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </form>

      {/* Cart Summary Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Shopping Cart ({items.length} items)</h3>
          {items.length > 0 && (
            <button onClick={handleReset} className="btn-secondary text-xs py-1 px-3 text-rose-500 hover:text-rose-600">
              <RotateCcw className="w-3.5 h-3.5" /> Clear Cart
            </button>
          )}
        </div>

        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-3.5">Item</th>
              <th className="p-3.5 text-center">Qty</th>
              <th className="p-3.5 text-right">Unit Price</th>
              <th className="p-3.5 text-right">Discount</th>
              <th className="p-3.5 text-right">Total</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
            {items.map(item => {
              const { finalTotal, discountAmt } = calculateItemTotal(item);

              return (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-sans font-semibold text-slate-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="p-3.5 text-center text-slate-500">
                    {item.quantity}
                  </td>
                  <td className="p-3.5 text-right text-slate-500">
                    {currency} {formatNumber(item.unitPrice, 2)}
                  </td>
                  <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400">
                    {item.discountPercent > 0 ? `-${currency}${formatNumber(discountAmt, 2)} (${item.discountPercent}%)` : '0%'}
                  </td>
                  <td className="p-3.5 text-right font-bold text-slate-900 dark:text-white">
                    {currency} {formatNumber(finalTotal, 2)}
                  </td>
                  <td className="p-3.5 text-right font-sans">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/60 font-mono">
            <tr>
              <td colSpan={4} className="p-3.5 font-sans font-bold text-right text-slate-700 dark:text-slate-300">
                Grand Total:
              </td>
              <td className="p-3.5 font-black text-right text-sm text-slate-900 dark:text-white">
                {currency} {formatNumber(grandTotal, 2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
