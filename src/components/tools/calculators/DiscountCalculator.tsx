import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const DiscountCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [originalPrice, setOriginalPrice] = useState<number | ''>(100);
  const [discountPercent, setDiscountPercent] = useState<number | ''>(20);
  const [additionalDiscount, setAdditionalDiscount] = useState<number | ''>(5);
  const [taxPercent, setTaxPercent] = useState<number | ''>(0);

  const calculate = () => {
    const price = Number(originalPrice) || 0;
    const disc1 = Number(discountPercent) || 0;
    const disc2 = Number(additionalDiscount) || 0;
    const tax = Number(taxPercent) || 0;

    // After primary discount
    const priceAfterDisc1 = price - (price * disc1) / 100;
    // After secondary discount
    const priceAfterDisc2 = priceAfterDisc1 - (priceAfterDisc1 * disc2) / 100;
    // Tax added
    const taxAmount = (priceAfterDisc2 * tax) / 100;
    const finalPrice = priceAfterDisc2 + taxAmount;
    const totalSavings = price - priceAfterDisc2;
    const effectiveDiscountPercent = price > 0 ? (totalSavings / price) * 100 : 0;

    return {
      price,
      finalPrice,
      totalSavings,
      effectiveDiscountPercent,
      taxAmount
    };
  };

  const res = calculate();

  const handleReset = () => {
    setOriginalPrice(100);
    setDiscountPercent(20);
    setAdditionalDiscount(0);
    setTaxPercent(0);
  };

  const handleCopy = () => {
    copyToClipboard(
      `Original: $${res.price.toFixed(2)}, Final: $${res.finalPrice.toFixed(2)}, Saved: $${res.totalSavings.toFixed(2)} (${res.effectiveDiscountPercent.toFixed(1)}% off)`
    );
    showToast('Discount summary copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Original Price ($)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Discount (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="20"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Additional Coupon (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={additionalDiscount}
            onChange={(e) => setAdditionalDiscount(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Sales Tax (%)
          </label>
          <input
            type="number"
            min="0"
            value={taxPercent}
            onChange={(e) => setTaxPercent(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="0"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleReset} className="btn-secondary">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Price Breakdown</h3>
          <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
            <Copy className="w-3.5 h-3.5" /> Copy Summary
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ${res.finalPrice.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Final Price to Pay</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ${res.totalSavings.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Total Saved</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {res.effectiveDiscountPercent.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Effective Discount</div>
          </div>
        </div>
      </div>
    </div>
  );
};
