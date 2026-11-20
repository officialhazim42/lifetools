import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const SalaryCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [grossSalary, setGrossSalary] = useState<number | ''>(65000);
  const [payPeriod, setPayPeriod] = useState<'annual' | 'monthly' | 'hourly'>('annual');
  const [hoursPerWeek, setHoursPerWeek] = useState<number | ''>(40);
  const [estimatedTaxRate, setEstimatedTaxRate] = useState<number | ''>(22);

  const calculate = () => {
    const rawVal = Number(grossSalary) || 0;
    const hrs = Number(hoursPerWeek) || 40;
    const taxRate = Number(estimatedTaxRate) || 0;

    let annualGross = 0;
    if (payPeriod === 'annual') {
      annualGross = rawVal;
    } else if (payPeriod === 'monthly') {
      annualGross = rawVal * 12;
    } else {
      annualGross = rawVal * hrs * 52;
    }

    const annualTax = (annualGross * taxRate) / 100;
    const annualNet = annualGross - annualTax;

    const monthlyGross = annualGross / 12;
    const monthlyNet = annualNet / 12;

    const biweeklyGross = annualGross / 26;
    const biweeklyNet = annualNet / 26;

    const weeklyGross = annualGross / 52;
    const weeklyNet = annualNet / 52;

    const hourlyGross = hrs > 0 ? annualGross / (hrs * 52) : 0;
    const hourlyNet = hrs > 0 ? annualNet / (hrs * 52) : 0;

    return {
      annualGross,
      annualNet,
      annualTax,
      monthlyGross,
      monthlyNet,
      biweeklyGross,
      biweeklyNet,
      weeklyGross,
      weeklyNet,
      hourlyGross,
      hourlyNet,
      taxRate
    };
  };

  const res = calculate();

  const handleCopy = () => {
    copyToClipboard(
      `Gross Annual: $${res.annualGross.toFixed(2)}, Net Take-Home: $${res.annualNet.toFixed(2)}/yr ($${res.monthlyNet.toFixed(2)}/mo)`
    );
    showToast('Salary details copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Gross Amount ($)
          </label>
          <input
            type="number"
            min="0"
            value={grossSalary}
            onChange={(e) => setGrossSalary(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="65000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Pay Frequency
          </label>
          <select
            value={payPeriod}
            onChange={(e) => setPayPeriod(e.target.value as any)}
            className="input-base"
          >
            <option value="annual">Per Year</option>
            <option value="monthly">Per Month</option>
            <option value="hourly">Per Hour</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Hours / Week
          </label>
          <input
            type="number"
            min="1"
            max="168"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="40"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Estimated Deductions (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={estimatedTaxRate}
            onChange={(e) => setEstimatedTaxRate(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="22"
          />
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Take-Home Pay Summary</h3>
          <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              ${res.annualGross.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Gross Annual Salary</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
            <div className="text-2xl font-bold text-rose-500">
              -${res.annualTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Estimated Taxes & Deductions ({res.taxRate}%)</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ${res.annualNet.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">Annual Net Take-Home</div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg">
            <thead className="bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300">
              <tr>
                <th className="p-2.5">Frequency</th>
                <th className="p-2.5">Gross Pay</th>
                <th className="p-2.5">Tax ({res.taxRate}%)</th>
                <th className="p-2.5">Net Pay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-400">
              <tr>
                <td className="p-2.5 font-medium text-slate-900 dark:text-white">Annual</td>
                <td className="p-2.5">${res.annualGross.toFixed(2)}</td>
                <td className="p-2.5 text-rose-500">${res.annualTax.toFixed(2)}</td>
                <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">${res.annualNet.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-slate-900 dark:text-white">Monthly</td>
                <td className="p-2.5">${res.monthlyGross.toFixed(2)}</td>
                <td className="p-2.5 text-rose-500">${(res.annualTax / 12).toFixed(2)}</td>
                <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">${res.monthlyNet.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-slate-900 dark:text-white">Bi-Weekly</td>
                <td className="p-2.5">${res.biweeklyGross.toFixed(2)}</td>
                <td className="p-2.5 text-rose-500">${(res.annualTax / 26).toFixed(2)}</td>
                <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">${res.biweeklyNet.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-slate-900 dark:text-white">Weekly</td>
                <td className="p-2.5">${res.weeklyGross.toFixed(2)}</td>
                <td className="p-2.5 text-rose-500">${(res.annualTax / 52).toFixed(2)}</td>
                <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">${res.weeklyNet.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-slate-900 dark:text-white">Hourly</td>
                <td className="p-2.5">${res.hourlyGross.toFixed(2)}/hr</td>
                <td className="p-2.5 text-rose-500">${(res.hourlyGross - res.hourlyNet).toFixed(2)}/hr</td>
                <td className="p-2.5 font-bold text-emerald-600 dark:text-emerald-400">${res.hourlyNet.toFixed(2)}/hr</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
