import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, RotateCcw } from 'lucide-react';

export const EmiCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [loanAmount, setLoanAmount] = useState<number | ''>(50000);
  const [interestRate, setInterestRate] = useState<number | ''>(8.5);
  const [tenureYears, setTenureYears] = useState<number | ''>(5);

  const calculate = () => {
    const P = Number(loanAmount) || 0;
    const annualRate = Number(interestRate) || 0;
    const years = Number(tenureYears) || 0;

    if (P <= 0 || annualRate <= 0 || years <= 0) return null;

    const r = annualRate / 12 / 100; // monthly interest rate
    const n = years * 12; // total monthly installments

    // EMI formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    // Amortization yearly breakdown (first 10 years max or full)
    const breakdown = [];
    let balance = P;
    for (let yr = 1; yr <= years; yr++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      for (let m = 1; m <= 12; m++) {
        const mInterest = balance * r;
        const mPrincipal = emi - mInterest;
        yearlyInterest += mInterest;
        yearlyPrincipal += mPrincipal;
        balance -= mPrincipal;
        if (balance < 0) balance = 0;
      }
      breakdown.push({
        year: yr,
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        balance: balance
      });
    }

    return {
      emi,
      totalPayment,
      totalInterest,
      principalPercent: (P / totalPayment) * 100,
      interestPercent: (totalInterest / totalPayment) * 100,
      breakdown
    };
  };

  const res = calculate();

  const handleCopy = () => {
    if (!res) return;
    copyToClipboard(
      `Monthly EMI: $${res.emi.toFixed(2)}, Total Interest: $${res.totalInterest.toFixed(2)}, Total Payable: $${res.totalPayment.toFixed(2)}`
    );
    showToast('EMI summary copied!');
  };

  const handleReset = () => {
    setLoanAmount(50000);
    setInterestRate(8.5);
    setTenureYears(5);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Loan Amount ($)
          </label>
          <input
            type="number"
            min="1"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="50000"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Interest Rate (% p.a.)
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="8.5"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase">
            Tenure (Years)
          </label>
          <input
            type="number"
            min="1"
            max="35"
            value={tenureYears}
            onChange={(e) => setTenureYears(e.target.value === '' ? '' : Number(e.target.value))}
            className="input-base"
            placeholder="5"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleReset} className="btn-secondary">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      {res && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Loan Summary</h3>
            <button onClick={handleCopy} className="btn-secondary text-xs py-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
              <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ${res.emi.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Monthly EMI</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                ${res.totalInterest.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Total Interest ({res.interestPercent.toFixed(1)}%)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                ${res.totalPayment.toFixed(2)}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">Total Payment (P + I)</div>
            </div>
          </div>

          {/* Amortization Schedule Table */}
          <div className="mt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              Yearly Amortization Schedule
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-lg">
                <thead className="bg-slate-50 dark:bg-slate-850 text-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="p-2.5">Year</th>
                    <th className="p-2.5">Principal Paid</th>
                    <th className="p-2.5">Interest Paid</th>
                    <th className="p-2.5">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-600 dark:text-slate-400">
                  {res.breakdown.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                      <td className="p-2.5 font-medium text-slate-900 dark:text-white">{row.year}</td>
                      <td className="p-2.5">${row.principal.toFixed(2)}</td>
                      <td className="p-2.5 text-amber-600 dark:text-amber-400">${row.interest.toFixed(2)}</td>
                      <td className="p-2.5 font-semibold">${row.balance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
