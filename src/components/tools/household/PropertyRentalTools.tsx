import React, { useState } from 'react';
import {
  Building,
  ArrowLeftRight,
  Calculator,
  Percent,
  DollarSign,
  TrendingUp,
  Scale,
  ShieldAlert,
  Copy,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Info
} from 'lucide-react';
import {
  convertPropertyArea,
  calculatePropertyPrice,
  calculateRegistrationExpenses,
  calculateRentalYield,
  calculateMortgagePiti,
  calculateLoanAffordability,
  calculatePropertyInvestment,
  calculateRentVsBuy,
  MarlaStandard,
  MARLA_STANDARDS,
  PropertyAreaUnits
} from '../../../utils/household/propertyCalculators';

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

// 56. Property Area Converter
export const PropertyAreaConverter: React.FC = () => {
  const [val, setVal] = useState<number>(10);
  const [fromUnit, setFromUnit] = useState<keyof PropertyAreaUnits>('marlas');
  const [marlaStd, setMarlaStd] = useState<MarlaStandard>('lda_modern');
  const [customSqFt, setCustomSqFt] = useState<number>(225);
  const { copied, copy } = useCopy();

  const conv = convertPropertyArea(val, fromUnit, marlaStd, customSqFt);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs space-y-2">
        <div className="flex items-center gap-2 font-semibold text-amber-900 dark:text-amber-200">
          <Info className="w-4 h-4 text-amber-600" />
          <span>Regional Cadastral Standard: {MARLA_STANDARDS[marlaStd].name}</span>
        </div>
        <p className="text-amber-800/80 dark:text-amber-300/80">
          {MARLA_STANDARDS[marlaStd].description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Area Quantity</label>
          <input
            type="number"
            value={val}
            onChange={e => setVal(Math.max(0, Number(e.target.value)))}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Source Unit</label>
          <select
            value={fromUnit}
            onChange={e => setFromUnit(e.target.value as any)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm"
          >
            <option value="sqFeet">Square Feet (sq ft)</option>
            <option value="sqMeters">Square Meters (m²)</option>
            <option value="sqYards">Square Yards / Gaj</option>
            <option value="acres">Acres</option>
            <option value="hectares">Hectares</option>
            <option value="kanals">Kanals (20 Marlas)</option>
            <option value="marlas">Marlas</option>
            <option value="bighas">Bighas (Pucca)</option>
            <option value="gunthas">Gunthas</option>
            <option value="cents">Cents</option>
            <option value="grounds">Grounds</option>
          </select>
        </div>
        <div>
          <label className="font-semibold block mb-1">Kanal / Marla Basis Standard</label>
          <select
            value={marlaStd}
            onChange={e => setMarlaStd(e.target.value as any)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm"
          >
            <option value="lda_modern">Modern / LDA (225 sq ft / Marla)</option>
            <option value="traditional_revenue">Traditional Revenue (272.25 sq ft / Marla)</option>
            <option value="commercial">Commercial (200 sq ft / Marla)</option>
            <option value="custom">Custom Sq Ft per Marla</option>
          </select>
          {marlaStd === 'custom' && (
            <input
              type="number"
              placeholder="Sq Ft / Marla"
              value={customSqFt}
              onChange={e => setCustomSqFt(Number(e.target.value))}
              className="mt-2 w-full px-2 py-1 bg-white dark:bg-slate-800 border rounded text-xs"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-white dark:bg-slate-900 border rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase">Square Feet</span>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {conv.sqFeet.toLocaleString()} sq ft
          </div>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 border rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase">Square Meters</span>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {conv.sqMeters.toLocaleString()} m²
          </div>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 border rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase">Square Yards (Gaj)</span>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {conv.sqYards.toLocaleString()} yd²
          </div>
        </div>
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl">
          <span className="text-[10px] text-emerald-700 uppercase font-semibold">Marlas</span>
          <div className="text-xl font-bold font-mono text-emerald-900 mt-1">
            {conv.marlas} Marla
          </div>
        </div>
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl">
          <span className="text-[10px] text-emerald-700 uppercase font-semibold">Kanals</span>
          <div className="text-xl font-bold font-mono text-emerald-900 mt-1">
            {conv.kanals} Kanal
          </div>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 border rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase">Acres</span>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {conv.acres} Acre
          </div>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 border rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase">Bighas</span>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {conv.bighas} Bigha
          </div>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 border rounded-xl">
          <span className="text-[10px] text-slate-400 uppercase">Gunthas</span>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {conv.gunthas} Guntha
          </div>
        </div>
      </div>
    </div>
  );
};

// 57. Square Feet to Square Meter Converter
export const SquareFeetToSquareMeterConverter: React.FC = () => {
  const [sqFt, setSqFt] = useState<number>(1000);
  const sqM = sqFt / 10.7639104;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="p-5 bg-slate-50 dark:bg-slate-900 border rounded-xl space-y-4">
        <div>
          <label className="text-xs font-semibold block mb-1">Square Feet</label>
          <input
            type="number"
            value={sqFt}
            onChange={e => setSqFt(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm"
          />
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl text-center">
          <span className="text-xs text-emerald-700 uppercase font-semibold">Square Meters</span>
          <div className="text-3xl font-bold font-mono text-emerald-900 mt-1">
            {sqM.toFixed(2)} m²
          </div>
          <span className="text-xs text-emerald-600 mt-1 block">1 m² = 10.7639 sq ft</span>
        </div>
      </div>
    </div>
  );
};

// 58. Acre to Kanal Converter
export const AcreToKanalConverter: React.FC = () => {
  const [acres, setAcres] = useState<number>(2.5);
  const [std, setStd] = useState<MarlaStandard>('traditional_revenue');

  // Under revenue standard 1 Acre = 8 Kanals
  // Under LDA 225 sq ft, 1 Acre (43,560 sq ft) / (20 * 225 = 4500) = 9.68 Kanals
  const kanals = std === 'traditional_revenue' ? acres * 8 : (acres * 43560) / 4500;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="p-5 bg-slate-50 dark:bg-slate-900 border rounded-xl space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold block mb-1">Acres</label>
            <input
              type="number"
              value={acres}
              onChange={e => setAcres(Number(e.target.value))}
              className="w-full px-2 py-1.5 border rounded"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Standard</label>
            <select value={std} onChange={e => setStd(e.target.value as any)} className="w-full px-2 py-1.5 border rounded">
              <option value="traditional_revenue">Cadastral Revenue (1 Acre = 8 Kanals)</option>
              <option value="lda_modern">Modern Housing (1 Acre = 9.68 Kanals)</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl text-center">
          <span className="text-xs text-emerald-700 uppercase font-semibold">Total Kanals</span>
          <div className="text-3xl font-bold font-mono text-emerald-900 mt-1">
            {kanals.toFixed(2)} Kanals
          </div>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">({(kanals * 20).toFixed(0)} Marlas)</span>
        </div>
      </div>
    </div>
  );
};

// 59. Kanal to Marla Converter
export const KanalToMarlaConverter: React.FC = () => {
  const [kanals, setKanals] = useState<number>(1);
  const marlas = kanals * 20;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="p-5 bg-slate-50 dark:bg-slate-900 border rounded-xl space-y-4">
        <div>
          <label className="text-xs font-semibold block mb-1">Kanals</label>
          <input
            type="number"
            value={kanals}
            onChange={e => setKanals(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm"
          />
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl text-center">
          <span className="text-xs text-emerald-700 uppercase font-semibold">Equivalent Marlas</span>
          <div className="text-3xl font-bold font-mono text-emerald-900 mt-1">
            {marlas} Marla
          </div>
          <span className="text-xs text-emerald-600 mt-1 block">Rule: 1 Kanal = 20 Marlas universally</span>
        </div>
      </div>
    </div>
  );
};

// 60. Marla to Square Feet Converter
export const MarlaToSquareFeetConverter: React.FC = () => {
  const [marlas, setMarlas] = useState<number>(5);
  const [std, setStd] = useState<MarlaStandard>('lda_modern');

  const sqFt = std === 'lda_modern' ? marlas * 225 : std === 'traditional_revenue' ? marlas * 272.25 : marlas * 200;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="p-5 bg-slate-50 dark:bg-slate-900 border rounded-xl space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold block mb-1">Marlas</label>
            <input
              type="number"
              value={marlas}
              onChange={e => setMarlas(Number(e.target.value))}
              className="w-full px-2 py-1.5 border rounded"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Standard Definition</label>
            <select value={std} onChange={e => setStd(e.target.value as any)} className="w-full px-2 py-1.5 border rounded">
              <option value="lda_modern">Modern Housing / LDA (225 sq ft)</option>
              <option value="traditional_revenue">Revenue Record (272.25 sq ft)</option>
              <option value="commercial">Commercial Scheme (200 sq ft)</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl text-center">
          <span className="text-xs text-emerald-700 uppercase font-semibold">Square Feet</span>
          <div className="text-3xl font-bold font-mono text-emerald-900 mt-1">
            {sqFt.toLocaleString()} sq ft
          </div>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">
            ~{(sqFt / 9).toFixed(1)} Sq Yards (Gaj) | ~{(sqFt * 0.092903).toFixed(1)} m²
          </span>
        </div>
      </div>
    </div>
  );
};

// 61. Property Price Calculator
export const PropertyPriceCalculator: React.FC = () => {
  const [area, setArea] = useState<number>(10);
  const [unit, setUnit] = useState<string>('Marla');
  const [rate, setRate] = useState<number>(1500000);
  const [cornerPct, setCornerPct] = useState<number>(10);
  const [parkPct, setParkPct] = useState<number>(5);
  const [devCharges, setDevCharges] = useState<number>(200000);

  const res = calculatePropertyPrice({
    area,
    ratePerUnit: rate,
    cornerPlotPremiumPercent: cornerPct,
    parkFacingPremiumPercent: parkPct,
    developmentCharges: devCharges
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Plot Area</label>
          <input type="number" value={area} onChange={e => setArea(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Area Unit</label>
          <select value={unit} onChange={e => setUnit(e.target.value)} className="w-full px-2 py-1.5 border rounded">
            <option>Marla</option>
            <option>Kanal</option>
            <option>Sq Yards / Gaj</option>
            <option>Sq Feet</option>
          </select>
        </div>
        <div>
          <label className="font-semibold block mb-1">Rate per {unit} ($)</label>
          <input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Corner Plot (%)</label>
          <input type="number" value={cornerPct} onChange={e => setCornerPct(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Park Facing (%)</label>
          <input type="number" value={parkPct} onChange={e => setParkPct(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Development Fees ($)</label>
          <input type="number" value={devCharges} onChange={e => setDevCharges(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-xl flex justify-between items-center">
        <div>
          <span className="text-xs uppercase text-slate-400">Total Plot Value</span>
          <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">
            ${res.grandTotal.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Base: ${res.basePrice.toLocaleString()} + Premiums: ${res.totalPremiums.toLocaleString()} + Dev: ${res.additionalFees.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

// 62. Property Registration Expense Estimator
export const PropertyRegistrationExpenseEstimator: React.FC = () => {
  const [val, setVal] = useState<number>(300000);
  const [stamp, setStamp] = useState<number>(3);
  const [reg, setReg] = useState<number>(1);
  const [transfer, setTransfer] = useState<number>(1);

  const res = calculateRegistrationExpenses(val, stamp, reg, transfer);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="col-span-2">
          <label className="font-semibold block mb-1">Assessed Property Value ($)</label>
          <input type="number" value={val} onChange={e => setVal(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded text-sm font-semibold" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Stamp Duty (%)</label>
          <input type="number" value={stamp} onChange={e => setStamp(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Registration (%)</label>
          <input type="number" value={reg} onChange={e => setReg(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-xl">
          <span className="text-xs text-slate-500 uppercase">Stamp Duty</span>
          <div className="text-2xl font-bold font-mono mt-1">${res.stampDuty.toLocaleString()}</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-xl">
          <span className="text-xs text-slate-500 uppercase">Registration Fee</span>
          <div className="text-2xl font-bold font-mono mt-1">${res.registrationFee.toLocaleString()}</div>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 rounded-xl">
          <span className="text-xs text-amber-700 uppercase font-semibold">Total Closing Taxes</span>
          <div className="text-2xl font-bold font-mono text-amber-900 mt-1">${res.totalExpenses.toLocaleString()}</div>
          <span className="text-[11px] text-amber-600 mt-0.5 block">{res.effectiveExpensePercent}% of value</span>
        </div>
      </div>
    </div>
  );
};

// 63. Rental Yield Calculator
export const RentalYieldCalculator: React.FC = () => {
  const [purchasePrice, setPurchasePrice] = useState<number>(350000);
  const [monthlyRent, setMonthlyRent] = useState<number>(2200);
  const [maint, setMaint] = useState<number>(1500);
  const [tax, setTax] = useState<number>(3500);

  const res = calculateRentalYield(purchasePrice, monthlyRent, maint, tax);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Purchase Price ($)</label>
          <input type="number" value={purchasePrice} onChange={e => setPurchasePrice(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Monthly Rent ($)</label>
          <input type="number" value={monthlyRent} onChange={e => setMonthlyRent(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Annual Maintenance ($)</label>
          <input type="number" value={maint} onChange={e => setMaint(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Annual Property Tax ($)</label>
          <input type="number" value={tax} onChange={e => setTax(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="p-5 bg-white dark:bg-slate-900 border rounded-xl">
          <span className="text-xs text-slate-500 uppercase">Gross Rental Yield</span>
          <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {res.grossYieldPercent}%
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Gross: ${res.grossAnnualRent.toLocaleString()} / year</span>
        </div>
        <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl">
          <span className="text-xs text-emerald-700 uppercase font-semibold">Net Rental Yield</span>
          <div className="text-3xl font-bold font-mono text-emerald-900 mt-1">
            {res.netYieldPercent}%
          </div>
          <span className="text-xs text-emerald-600 mt-1 block">Net: ${res.netAnnualIncome.toLocaleString()} / year</span>
        </div>
      </div>
    </div>
  );
};

// 64. Monthly Rent Splitter
export const MonthlyRentSplitter: React.FC = () => {
  const [rent, setRent] = useState<number>(2000);
  const [tenants, setTenants] = useState<number>(3);
  const [util, setUtil] = useState<number>(300);

  const total = rent + util;
  const perPerson = total / Math.max(1, tenants);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Monthly Rent ($)</label>
          <input type="number" value={rent} onChange={e => setRent(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Utilities ($)</label>
          <input type="number" value={util} onChange={e => setUtil(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Tenants</label>
          <input type="number" min="1" value={tenants} onChange={e => setTenants(Math.max(1, Number(e.target.value)))} className="w-full px-2 py-1.5 border rounded" />
        </div>
      </div>

      <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl text-center">
        <span className="text-xs text-emerald-700 uppercase font-semibold">Equal Split per Tenant</span>
        <div className="text-3xl font-bold font-mono text-emerald-900 mt-1">${perPerson.toFixed(2)} / month</div>
        <span className="text-xs text-emerald-600 mt-1 block">Includes ${ (rent / tenants).toFixed(2) } rent + ${ (util / tenants).toFixed(2) } utilities</span>
      </div>
    </div>
  );
};

// 65. Security Deposit Calculator
export const SecurityDepositCalculator: React.FC = () => {
  const [rent, setRent] = useState<number>(1800);
  const [months, setMonths] = useState<number>(1.5);
  const [petDeposit, setPetDeposit] = useState<number>(300);
  const [keyDeposit, setKeyDeposit] = useState<number>(50);

  const baseDeposit = rent * months;
  const totalDeposit = baseDeposit + petDeposit + keyDeposit;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Monthly Rent ($)</label>
          <input type="number" value={rent} onChange={e => setRent(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Deposit Months</label>
          <input type="number" step="0.5" value={months} onChange={e => setMonths(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Pet Deposit ($)</label>
          <input type="number" value={petDeposit} onChange={e => setPetDeposit(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Key/Access ($)</label>
          <input type="number" value={keyDeposit} onChange={e => setKeyDeposit(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
      </div>

      <div className="bg-slate-900 text-white p-5 rounded-xl flex justify-between items-center">
        <div>
          <span className="text-xs uppercase text-slate-400">Total Refundable Move-In Deposit</span>
          <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">${totalDeposit.toLocaleString()}</div>
          <p className="text-xs text-slate-400 mt-1">Base: ${baseDeposit} + Pet: ${petDeposit} + Key: ${keyDeposit}</p>
        </div>
      </div>
    </div>
  );
};

// 66. Property Mortgage Calculator
export const PropertyMortgageCalculator: React.FC = () => {
  const [homePrice, setHomePrice] = useState<number>(450000);
  const [downPayment, setDownPayment] = useState<number>(90000);
  const [rate, setRate] = useState<number>(6.5);
  const [term, setTerm] = useState<number>(30);

  const res = calculateMortgagePiti(homePrice, downPayment, rate, term);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Home Price ($)</label>
          <input type="number" value={homePrice} onChange={e => setHomePrice(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Down Payment ($)</label>
          <input type="number" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Interest Rate (%)</label>
          <input type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Loan Term (Yrs)</label>
          <select value={term} onChange={e => setTerm(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded">
            <option value={15}>15 Years</option>
            <option value={20}>20 Years</option>
            <option value={30}>30 Years</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-xs uppercase text-slate-400">Total Monthly PITI Payment</span>
          <div className="text-4xl font-extrabold font-mono text-emerald-400 mt-1">
            ${res.totalMonthlyPiti.toFixed(2)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Principal & Interest: ${res.monthlyPrincipalAndInterest.toFixed(2)}/mo</p>
        </div>
        <div className="text-xs text-right space-y-1 text-slate-300">
          <div>Property Tax: <strong>${res.monthlyPropertyTax.toFixed(2)}/mo</strong></div>
          <div>Homeowners Ins: <strong>${res.monthlyInsurance.toFixed(2)}/mo</strong></div>
          <div>PMI: <strong>${res.monthlyPmi.toFixed(2)}/mo</strong></div>
          <div>Total Interest Paid: <strong>${res.totalInterestPaid.toLocaleString()}</strong></div>
        </div>
      </div>
    </div>
  );
};

// 67. Home Loan Affordability Calculator
export const HomeLoanAffordabilityCalculator: React.FC = () => {
  const [income, setIncome] = useState<number>(8500);
  const [debt, setDebt] = useState<number>(500);
  const [savings, setSavings] = useState<number>(60000);
  const [rate, setRate] = useState<number>(6.5);

  const res = calculateLoanAffordability(income, debt, savings, rate);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Gross Monthly Income ($)</label>
          <input type="number" value={income} onChange={e => setIncome(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Monthly Debt Payments ($)</label>
          <input type="number" value={debt} onChange={e => setDebt(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Down Payment Saved ($)</label>
          <input type="number" value={savings} onChange={e => setSavings(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Mortgage Rate (%)</label>
          <input type="number" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
      </div>

      <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl text-center">
        <span className="text-xs text-emerald-700 uppercase font-semibold">Maximum Affordable Home Purchase Price</span>
        <div className="text-4xl font-extrabold font-mono text-emerald-900 mt-1">
          ${res.maxAffordableHomePrice.toLocaleString()}
        </div>
        <p className="text-xs text-emerald-700 mt-1">
          Max Monthly Payment: ${res.maxMonthlyPaymentAllowed} | Max Loan: ${res.maxBorrowingCapacity.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

// 68. Property Investment Calculator
export const PropertyInvestmentCalculator: React.FC = () => {
  const [price, setPrice] = useState<number>(400000);
  const [rent, setRent] = useState<number>(2800);
  const [exp, setExp] = useState<number>(700);

  const res = calculatePropertyInvestment(price, 20, 3, rent, exp);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Purchase Price ($)</label>
          <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Monthly Gross Rent ($)</label>
          <input type="number" value={rent} onChange={e => setRent(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Monthly Operating Exp ($)</label>
          <input type="number" value={exp} onChange={e => setExp(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-xl">
          <span className="text-xs text-slate-500 uppercase">Cap Rate</span>
          <div className="text-2xl font-bold font-mono mt-1">{res.capRatePercent}%</div>
          <span className="text-[11px] text-slate-400">NOI / Price</span>
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl">
          <span className="text-xs text-emerald-700 uppercase font-semibold">Cash-on-Cash Return</span>
          <div className="text-2xl font-bold font-mono text-emerald-900 mt-1">{res.cashOnCashReturnPercent}%</div>
          <span className="text-[11px] text-emerald-600">On initial cash</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border rounded-xl">
          <span className="text-xs text-slate-500 uppercase">Annual NOI</span>
          <div className="text-2xl font-bold font-mono mt-1">${res.netOperatingIncome.toLocaleString()}</div>
          <span className="text-[11px] text-slate-400">Net Operating Income</span>
        </div>
      </div>
    </div>
  );
};

// 69. Rent vs Buy Calculator
export const RentVsBuyCalculator: React.FC = () => {
  const [rent, setRent] = useState<number>(1800);
  const [price, setPrice] = useState<number>(380000);
  const [down, setDown] = useState<number>(76000);
  const [years, setYears] = useState<number>(10);

  const res = calculateRentVsBuy(rent, price, down, 6.5, years);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Monthly Rent ($)</label>
          <input type="number" value={rent} onChange={e => setRent(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Home Price ($)</label>
          <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Down Payment ($)</label>
          <input type="number" value={down} onChange={e => setDown(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded" />
        </div>
        <div>
          <label className="font-semibold block mb-1">Years to Compare</label>
          <select value={years} onChange={e => setYears(Number(e.target.value))} className="w-full px-2 py-1.5 border rounded">
            <option value={5}>5 Years</option>
            <option value={10}>10 Years</option>
            <option value={15}>15 Years</option>
            <option value={20}>20 Years</option>
          </select>
        </div>
      </div>

      <div className="p-5 bg-slate-900 text-white rounded-xl space-y-2">
        <span className="text-xs uppercase text-slate-400">Financial Recommendation ({years} Years)</span>
        <p className="text-sm font-semibold text-emerald-400">{res.recommendation}</p>
        <p className="text-xs text-slate-400">
          Estimated Buyer Monthly PITI: ~${res.monthlyMortgagePitiEst}/mo vs Initial Rent: ${rent}/mo
        </p>
      </div>
    </div>
  );
};

// 70. Property Expense Tracker
export const PropertyExpenseTracker: React.FC = () => {
  const [expenses, setExpenses] = useState<Array<{ id: string; date: string; category: string; amount: number; payee: string }>>([
    { id: '1', date: '2026-11-01', category: 'Mortgage', amount: 1850, payee: 'Chase Mortgage' },
    { id: '2', date: '2026-11-05', category: 'Property Tax', amount: 450, payee: 'County Tax Assessor' },
    { id: '3', date: '2026-11-10', category: 'HOA Dues', amount: 120, payee: 'Oak Ridge HOA' }
  ]);
  const [cat, setCat] = useState('Mortgage');
  const [amt, setAmt] = useState<number>(0);
  const [payee, setPayee] = useState('');

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (amt <= 0) return;
    setExpenses([...expenses, { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], category: cat, amount: amt, payee: payee || 'Payee' }]);
    setAmt(0);
    setPayee('');
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <h3 className="font-semibold text-sm">Property Operating Expense Tracker</h3>
          <p className="text-slate-500">{expenses.length} operating disbursements</p>
        </div>
        <div className="text-right">
          <span className="text-slate-500">Total Outflow:</span>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            ${total.toLocaleString()}
          </div>
        </div>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 text-xs">
        <select value={cat} onChange={e => setCat(e.target.value)} className="px-2 py-2 border rounded-lg">
          <option>Mortgage</option>
          <option>Property Tax</option>
          <option>HOA Dues</option>
          <option>Insurance</option>
          <option>Repairs</option>
        </select>
        <input
          type="number"
          placeholder="Amount ($)"
          value={amt || ''}
          onChange={e => setAmt(Number(e.target.value))}
          className="w-28 px-2 py-2 border rounded-lg font-mono"
        />
        <input
          type="text"
          placeholder="Payee / Provider..."
          value={payee}
          onChange={e => setPayee(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg"
        />
        <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-1 font-medium">
          <Plus className="w-3.5 h-3.5" /> Add
        </button>
      </form>

      <div className="space-y-2 text-xs">
        {expenses.map(e => (
          <div key={e.id} className="p-3 bg-white dark:bg-slate-900 border rounded-xl flex justify-between items-center">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{e.category}</span>
              <p className="text-[11px] text-slate-400">{e.date} • {e.payee}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono font-bold text-slate-900 dark:text-white">${e.amount.toLocaleString()}</span>
              <button onClick={() => setExpenses(expenses.filter(x => x.id !== e.id))} className="text-slate-400 hover:text-rose-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
