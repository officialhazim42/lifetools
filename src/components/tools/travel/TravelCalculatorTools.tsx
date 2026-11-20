import React, { useState } from 'react';
import {
  convertDistance,
  calculateTripFuelCost,
  convertFuelMileage,
  calculateComprehensiveTripCost,
  calculateTravelTime,
  calculateAverageSpeed,
  calculateFlightDuration,
  calculateJetLag,
  convertCurrencyOffline,
  OFFLINE_BASELINE_RATES_USD,
  convertLuggageWeight,
  checkBaggageCompliance,
  AIRLINE_BAGGAGE_POLICIES,
  calculateEqualExpenseSettlement,
  ExpenseParticipant
} from '../../../utils/travel/travelCalculators';
import { useToast } from '../../../context/ToastContext';
import { copyToClipboard } from '../../../utils/formatters';
import {
  Fuel,
  Gauge,
  Wallet,
  Users,
  Clock,
  Plane,
  Coins,
  Luggage,
  Copy,
  RotateCcw,
  Plus,
  Trash2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Compass
} from 'lucide-react';

// ==========================================
// 1. Distance Calculator
// ==========================================
export const TravelDistanceCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [val, setVal] = useState<number>(100);
  const [fromUnit, setFromUnit] = useState<'km' | 'miles' | 'nm'>('km');

  const km = convertDistance(val, fromUnit, 'km');
  const miles = convertDistance(val, fromUnit, 'miles');
  const nm = convertDistance(val, fromUnit, 'nm');

  const handleCopy = () => {
    copyToClipboard(`${val} ${fromUnit} = ${km} km | ${miles} miles | ${nm} nautical miles`);
    showToast('Distance conversions copied', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Distance Value
          </label>
          <input
            type="number"
            min="0"
            value={val}
            onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Input Unit
          </label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value as any)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          >
            <option value="km">Kilometers (km)</option>
            <option value="miles">Statute Miles (mi)</option>
            <option value="nm">Nautical Miles (NM)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-400 block font-medium">Kilometers</span>
          <span className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1 block">{km} km</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-400 block font-medium">Miles</span>
          <span className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1 block">{miles} mi</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-400 block font-medium">Nautical Miles</span>
          <span className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1 block">{nm} NM</span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-lg transition-colors"
        >
          <Copy className="w-3.5 h-3.5" /> Copy Distance
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 2. Trip Fuel Cost Calculator
// ==========================================
export const TripFuelCostCalculator: React.FC = () => {
  const { showToast } = useToast();
  const [distance, setDistance] = useState<number>(450);
  const [distUnit, setDistUnit] = useState<'km' | 'miles'>('km');
  const [consumption, setConsumption] = useState<number>(7.5);
  const [consumptionType, setConsumptionType] = useState<'l_per_100km' | 'mpg_us' | 'km_per_l'>('l_per_100km');
  const [fuelPrice, setFuelPrice] = useState<number>(1.65);
  const [travelers, setTravelers] = useState<number>(3);

  const result = calculateTripFuelCost({
    distance,
    distanceUnit: distUnit,
    consumption,
    consumptionType,
    fuelPricePerUnit: fuelPrice,
    travelersCount: travelers
  });

  const handleCopy = () => {
    copyToClipboard(
      `Trip Fuel Estimate:\nDistance: ${distance} ${distUnit}\nTotal Fuel: ${result.totalFuelNeeded} units\nTotal Cost: $${result.totalCost}\nCost per Person (${travelers} travelers): $${result.costPerPerson}`
    );
    showToast('Fuel estimate copied', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Total Trip Distance
          </label>
          <div className="flex gap-1">
            <input
              type="number"
              min="1"
              value={distance}
              onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
              className="flex-1 px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
            />
            <select
              value={distUnit}
              onChange={(e) => setDistUnit(e.target.value as any)}
              className="px-2 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl"
            >
              <option value="km">km</option>
              <option value="miles">mi</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Fuel Efficiency
          </label>
          <div className="flex gap-1">
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={consumption}
              onChange={(e) => setConsumption(parseFloat(e.target.value) || 0)}
              className="flex-1 px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
            />
            <select
              value={consumptionType}
              onChange={(e) => setConsumptionType(e.target.value as any)}
              className="px-2 py-2 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl"
            >
              <option value="l_per_100km">L/100km</option>
              <option value="mpg_us">MPG (US)</option>
              <option value="km_per_l">km/L</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Fuel Price per Unit
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={fuelPrice}
            onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Travelers (for split)
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={travelers}
            onChange={(e) => setTravelers(parseInt(e.target.value, 10) || 1)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 text-center">
          <span className="text-xs text-slate-500 block">Total Fuel Required</span>
          <span className="text-xl font-bold text-sky-700 dark:text-sky-300 mt-1 block">
            {result.totalFuelNeeded} units
          </span>
        </div>
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 text-center">
          <span className="text-xs text-slate-500 block">Total Fuel Cost</span>
          <span className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-1 block">
            ${result.totalCost}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-500 block">Cost Per Person</span>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">
            ${result.costPerPerson}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
          <span className="text-xs text-slate-500 block">Cost per {distUnit}</span>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">
            ${result.costPerDistanceUnit}
          </span>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-lg transition-colors"
        >
          <Copy className="w-3.5 h-3.5" /> Copy Fuel Details
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 3. Vehicle Fuel Mileage Calculator
// ==========================================
export const VehicleFuelMileageCalculator: React.FC = () => {
  const [val, setVal] = useState<number>(32);
  const [type, setType] = useState<'mpg_us' | 'mpg_uk' | 'km_per_l' | 'l_per_100km'>('mpg_us');

  const res = convertFuelMileage(val, type);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Mileage Value
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={val}
            onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Specification Standard
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          >
            <option value="mpg_us">MPG (US)</option>
            <option value="mpg_uk">MPG (Imperial / UK)</option>
            <option value="km_per_l">Kilometers per Liter (km/L)</option>
            <option value="l_per_100km">Liters per 100km (L/100km)</option>
          </select>
        </div>
      </div>

      {res && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 block">US MPG</span>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">{res.mpgUs}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 block">UK MPG</span>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">{res.mpgUk}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 block">km / Liter</span>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">{res.kmPerLiter}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400 block">L / 100km</span>
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">{res.litersPer100Km}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. Trip Cost Calculator
// ==========================================
export const TripCostCalculator: React.FC = () => {
  const [fuel, setFuel] = useState<number>(180);
  const [tolls, setTolls] = useState<number>(35);
  const [nights, setNights] = useState<number>(4);
  const [nightlyStay, setNightlyStay] = useState<number>(120);
  const [days, setDays] = useState<number>(5);
  const [foodPerPerson, setFoodPerPerson] = useState<number>(40);
  const [activities, setActivities] = useState<number>(200);
  const [contingency, setContingency] = useState<number>(10);
  const [travelers, setTravelers] = useState<number>(2);

  const res = calculateComprehensiveTripCost({
    fuelOrTransitCost: fuel,
    tollsAndParking: tolls,
    nightsCount: nights,
    nightlyLodgingCost: nightlyStay,
    daysCount: days,
    dailyFoodPerPerson: foodPerPerson,
    activitiesTotal: activities,
    contingencyPercent: contingency,
    travelersCount: travelers
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-slate-500 mb-1">Fuel / Transit ($)</label>
          <input
            type="number"
            value={fuel}
            onChange={(e) => setFuel(parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Tolls & Parking ($)</label>
          <input
            type="number"
            value={tolls}
            onChange={(e) => setTolls(parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Nights Lodging</label>
          <input
            type="number"
            value={nights}
            onChange={(e) => setNights(parseInt(e.target.value, 10) || 0)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Nightly Lodging Rate ($)</label>
          <input
            type="number"
            value={nightlyStay}
            onChange={(e) => setNightlyStay(parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Trip Duration (Days)</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10) || 1)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Food / Person / Day ($)</label>
          <input
            type="number"
            value={foodPerPerson}
            onChange={(e) => setFoodPerPerson(parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Activities Total ($)</label>
          <input
            type="number"
            value={activities}
            onChange={(e) => setActivities(parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Contingency Buffer (%)</label>
          <input
            type="number"
            value={contingency}
            onChange={(e) => setContingency(parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Travelers Count</label>
          <input
            type="number"
            min="1"
            value={travelers}
            onChange={(e) => setTravelers(parseInt(e.target.value, 10) || 1)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 dark:border-slate-700/60 pb-3">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">Estimated Total Trip Cost</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-0.5">${res.grandTotal}</div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block">
              ${res.costPerTraveler} per traveler
            </span>
            <span className="text-[11px] text-slate-400">${res.costPerDay}/day overall</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-slate-400 block">Transport:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">${res.transportCost}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Lodging:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">${res.lodgingCost}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Food & Dining:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">${res.foodCost}</span>
          </div>
          <div>
            <span className="text-slate-400 block">Buffer (+{contingency}%):</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">${res.contingencyCost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. Travel Budget Estimator
// ==========================================
export const TravelBudgetEstimator: React.FC = () => {
  const [style, setStyle] = useState<'budget' | 'moderate' | 'luxury'>('moderate');
  const [days, setDays] = useState(7);
  const [travelers, setTravelers] = useState(2);
  const [flights, setFlights] = useState(600);

  // Daily per-person benchmarks
  const dailyRates = {
    budget: { stay: 35, food: 25, activities: 15 },
    moderate: { stay: 85, food: 55, activities: 35 },
    luxury: { stay: 240, food: 140, activities: 90 }
  };

  const current = dailyRates[style];
  const totalPerPersonPerDay = current.stay + current.food + current.activities;
  const onGroundTotal = totalPerPersonPerDay * days * travelers;
  const overallBudget = onGroundTotal + flights;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {(['budget', 'moderate', 'luxury'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
              style === s
                ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {s} Style
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block text-slate-500 mb-1">Duration (Days)</label>
          <input
            type="number"
            min="1"
            value={days}
            onChange={(e) => setDays(parseInt(e.target.value, 10) || 1)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Travelers Count</label>
          <input
            type="number"
            min="1"
            value={travelers}
            onChange={(e) => setTravelers(parseInt(e.target.value, 10) || 1)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Total Flights / Transit ($)</label>
          <input
            type="number"
            min="0"
            value={flights}
            onChange={(e) => setFlights(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Recommended Vacation Budget</span>
        <div className="text-4xl font-extrabold text-slate-900 dark:text-white">${overallBudget}</div>
        <p className="text-xs text-slate-500">
          Approx. ${Math.round(overallBudget / travelers)} per traveler (~${totalPerPersonPerDay}/day on-ground per person).
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 6. Road Trip Cost Splitter
// ==========================================
export const RoadTripCostSplitter: React.FC = () => {
  const [totalCost, setTotalCost] = useState(360);
  const [people, setPeople] = useState(['Alex', 'Sam', 'Jordan', 'Taylor']);
  const [driverDiscount, setDriverDiscount] = useState(15); // driver pays 15% less for driving

  const count = people.length;
  // If driver discount applies to people[0]
  const baseFraction = 100 / count;
  const driverShare = baseFraction * (1 - driverDiscount / 100);
  const remainingPercent = 100 - driverShare;
  const passengerShare = count > 1 ? remainingPercent / (count - 1) : 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-slate-500 mb-1">Total Trip Expense ($)</label>
          <input
            type="number"
            value={totalCost}
            onChange={(e) => setTotalCost(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Driver Fuel Discount (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={driverDiscount}
            onChange={(e) => setDriverDiscount(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Individual Contributions</span>
        {people.map((p, idx) => {
          const isDriver = idx === 0;
          const share = isDriver ? driverShare : passengerShare;
          const owes = Math.round((totalCost * (share / 100)) * 100) / 100;

          return (
            <div
              key={idx}
              className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{p}</span>
                {isDriver && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600">
                    Lead Driver (-{driverDiscount}%)
                  </span>
                )}
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white">${owes}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 7. Travel Time Estimator
// ==========================================
export const TravelTimeEstimator: React.FC = () => {
  const [dist, setDist] = useState(380);
  const [speed, setSpeed] = useState(90);
  const [stopInterval, setStopInterval] = useState(2.5);
  const [stopDuration, setStopDuration] = useState(20);

  const res = calculateTravelTime(dist, speed, stopInterval, stopDuration);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-slate-500 mb-1">Distance (km or mi)</label>
          <input
            type="number"
            value={dist}
            onChange={(e) => setDist(parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Average Speed (km/h or mph)</label>
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Break Every (Hours)</label>
          <input
            type="number"
            step="0.5"
            value={stopInterval}
            onChange={(e) => setStopInterval(parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Break Duration (Mins)</label>
          <input
            type="number"
            value={stopDuration}
            onChange={(e) => setStopDuration(parseInt(e.target.value, 10) || 0)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Estimated Total Travel Time</span>
        <div className="text-4xl font-black text-slate-900 dark:text-white">{res.formattedTotalTime}</div>
        <div className="text-xs text-slate-500 pt-2">
          Driving: {res.drivingHours}h {res.drivingMinutes}m • {res.stopsCount} rest stops ({res.stopsTotalMinutes} mins total)
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. Average Speed Calculator
// ==========================================
export const AverageTravelSpeedCalculator: React.FC = () => {
  const [dist, setDist] = useState(240);
  const [hours, setHours] = useState(3);
  const [mins, setMins] = useState(15);

  const res = calculateAverageSpeed(dist, hours, mins);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block text-slate-500 mb-1">Distance Covered</label>
          <input
            type="number"
            value={dist}
            onChange={(e) => setDist(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Hours Elapsed</label>
          <input
            type="number"
            min="0"
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Minutes Elapsed</label>
          <input
            type="number"
            min="0"
            max="59"
            value={mins}
            onChange={(e) => setMins(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-1">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Calculated Average Speed</span>
        <div className="text-4xl font-black text-slate-900 dark:text-white mt-1">{res.formatted}</div>
        <span className="text-xs text-slate-400">km/h or mph (matching your input distance unit)</span>
      </div>
    </div>
  );
};

// ==========================================
// 9. Flight Duration Calculator
// ==========================================
export const FlightDurationCalculator: React.FC = () => {
  const [distKm, setDistKm] = useState(5570); // London to NYC approx
  const [speed, setSpeed] = useState(860);

  const res = calculateFlightDuration(distKm, speed, 40);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-slate-500 mb-1">Great-Circle Flight Distance (km)</label>
          <input
            type="number"
            value={distKm}
            onChange={(e) => setDistKm(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Commercial Cruising Speed (km/h)</label>
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Gate-to-Gate Estimated Flight Time</span>
        <div className="text-4xl font-black text-slate-900 dark:text-white">{res.formattedDuration}</div>
        <p className="text-xs text-slate-500">
          Air time: {res.airTimeHours}h {res.airTimeMinutes}m • Includes ~40m standard airport taxiing, climb, and approach buffer.
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 10. Time Zone Converter
// ==========================================
export const TravelTimeZoneConverter: React.FC = () => {
  const [originOffset, setOriginOffset] = useState(-5); // EST (UTC-5)
  const [destOffset, setDestOffset] = useState(1); // CET (UTC+1)
  const [originTime, setOriginTime] = useState('14:00');

  const diffHours = destOffset - originOffset;

  // Calculate destination time
  const [h, m] = originTime.split(':').map((x) => parseInt(x, 10) || 0);
  let destH = (h + diffHours) % 24;
  if (destH < 0) destH += 24;
  const formattedDestTime = `${destH < 10 ? '0' : ''}${destH}:${m < 10 ? '0' : ''}${m}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block text-slate-500 mb-1">Departure Timezone (UTC Offset)</label>
          <select
            value={originOffset}
            onChange={(e) => setOriginOffset(parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          >
            <option value="-8">UTC-8 (PST / US West)</option>
            <option value="-5">UTC-5 (EST / US East)</option>
            <option value="0">UTC+0 (GMT / London)</option>
            <option value="1">UTC+1 (CET / Paris, Berlin)</option>
            <option value="3">UTC+3 (MSK / Dubai UTC+4)</option>
            <option value="5.5">UTC+5:30 (IST / India)</option>
            <option value="8">UTC+8 (SGT / HK / Singapore)</option>
            <option value="9">UTC+9 (JST / Tokyo)</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Local Time at Departure</label>
          <input
            type="time"
            value={originTime}
            onChange={(e) => setOriginTime(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Destination Timezone (UTC Offset)</label>
          <select
            value={destOffset}
            onChange={(e) => setDestOffset(parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          >
            <option value="-8">UTC-8 (PST / US West)</option>
            <option value="-5">UTC-5 (EST / US East)</option>
            <option value="0">UTC+0 (GMT / London)</option>
            <option value="1">UTC+1 (CET / Paris, Berlin)</option>
            <option value="3">UTC+3 (MSK / Dubai UTC+4)</option>
            <option value="5.5">UTC+5:30 (IST / India)</option>
            <option value="8">UTC+8 (SGT / HK / Singapore)</option>
            <option value="9">UTC+9 (JST / Tokyo)</option>
          </select>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Destination Local Time</span>
        <div className="text-4xl font-black text-slate-900 dark:text-white">{formattedDestTime}</div>
        <p className="text-xs text-slate-500">
          Time Difference: {diffHours >= 0 ? `+${diffHours}` : diffHours} hours {diffHours >= 0 ? 'ahead' : 'behind'}.
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 11. Jet Lag Recovery Calculator
// ==========================================
export const JetLagCalculator: React.FC = () => {
  const [fromUtc, setFromUtc] = useState(-5);
  const [toUtc, setToUtc] = useState(1);

  const plan = calculateJetLag(fromUtc, toUtc);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-slate-500 mb-1">Origin UTC Offset</label>
          <input
            type="number"
            value={fromUtc}
            onChange={(e) => setFromUtc(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Destination UTC Offset</label>
          <input
            type="number"
            value={toUtc}
            onChange={(e) => setToUtc(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700/60 pb-3">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">Circadian Disruption</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
              {plan.timeZonesCrossed} Time Zones ({plan.direction === 'east' ? 'Eastward' : 'Westward'})
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-sky-600 dark:text-sky-400 font-bold block">
              ~{plan.recoveryDays} Days Recovery
            </span>
          </div>
        </div>

        <div className="space-y-2 pt-1 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300 block">Adaptation Recommendations:</span>
          {plan.adaptationTips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 12. Travel Currency Converter (Offline Reference)
// ==========================================
export const TravelCurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(100);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [customRate, setCustomRate] = useState<string>('');

  const parsedCustom = customRate ? parseFloat(customRate) : undefined;
  const res = convertCurrencyOffline(amount, from, to, parsedCustom);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-slate-500 mb-1">Amount to Convert</label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">From Currency</label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          >
            {Object.keys(OFFLINE_BASELINE_RATES_USD).map((c) => (
              <option key={c} value={c}>
                {c} - {OFFLINE_BASELINE_RATES_USD[c].name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-slate-500 mb-1">To Currency</label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          >
            {Object.keys(OFFLINE_BASELINE_RATES_USD).map((c) => (
              <option key={c} value={c}>
                {c} - {OFFLINE_BASELINE_RATES_USD[c].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1">
          Custom Live/Bank Exchange Rate (Optional Override)
        </label>
        <input
          type="number"
          step="0.0001"
          placeholder="Leave blank to use offline baseline reference rate"
          value={customRate}
          onChange={(e) => setCustomRate(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
        />
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Converted Value</span>
        <div className="text-4xl font-black text-slate-900 dark:text-white">
          {res.convertedAmount} {to}
        </div>
        <p className="text-xs text-slate-500">
          Rate: 1 {from} = {res.rateUsed} {to} {res.isCustomRate ? '(Custom Rate Applied)' : '(Offline Benchmark)'}
        </p>
      </div>

      <div className="flex items-start gap-2.5 p-3 text-xs rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
        <p>{res.disclaimer}</p>
      </div>
    </div>
  );
};

// ==========================================
// 13. Luggage Weight Converter
// ==========================================
export const LuggageWeightConverter: React.FC = () => {
  const [val, setVal] = useState<number>(23); // standard 23kg / 50lbs
  const [unit, setUnit] = useState<'kg' | 'lbs' | 'oz' | 'stone'>('kg');

  const res = convertLuggageWeight(val, unit);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Suitcase / Bag Weight
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={val}
            onChange={(e) => setVal(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Unit
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as any)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          >
            <option value="kg">Kilograms (kg)</option>
            <option value="lbs">Pounds (lbs)</option>
            <option value="oz">Ounces (oz)</option>
            <option value="stone">Stones (st)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 block">Kilograms</span>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">{res.kg} kg</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 block">Pounds</span>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">{res.lbs} lbs</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 block">Ounces</span>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">{res.oz} oz</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 block">Stone</span>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1 block">{res.stone} st</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 14. Baggage Allowance Calculator
// ==========================================
export const BaggageAllowanceCalculator: React.FC = () => {
  const [selectedAirlineIdx, setSelectedAirlineIdx] = useState(0);
  const [bagType, setBagType] = useState<'carry_on' | 'checked'>('carry_on');
  const [length, setLength] = useState(54);
  const [width, setWidth] = useState(36);
  const [height, setHeight] = useState(22);
  const [weight, setWeight] = useState(9);

  const policy = AIRLINE_BAGGAGE_POLICIES[selectedAirlineIdx];
  const compliance = checkBaggageCompliance(length, width, height, weight, bagType, policy);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block text-slate-500 mb-1">Airline Policy Benchmark</label>
          <select
            value={selectedAirlineIdx}
            onChange={(e) => setSelectedAirlineIdx(parseInt(e.target.value, 10))}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          >
            {AIRLINE_BAGGAGE_POLICIES.map((p, idx) => (
              <option key={idx} value={idx}>
                {p.airlineName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Bag Classification</label>
          <div className="flex gap-2">
            <button
              onClick={() => setBagType('carry_on')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl border ${
                bagType === 'carry_on' ? 'bg-sky-500/10 border-sky-500 text-sky-600' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Carry-On / Cabin Bag
            </button>
            <button
              onClick={() => setBagType('checked')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl border ${
                bagType === 'checked' ? 'bg-sky-500/10 border-sky-500 text-sky-600' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              Checked Luggage
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="block text-slate-500 mb-1">Length (cm)</label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Width (cm)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Height (cm)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-500 mb-1">Weight (kg)</label>
          <input
            type="number"
            step="0.5"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
          />
        </div>
      </div>

      <div
        className={`p-5 rounded-2xl border text-center space-y-2 ${
          compliance.isCompliant
            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
            : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
        }`}
      >
        <span className="text-xs uppercase font-bold tracking-wider block">
          {compliance.isCompliant ? 'Complies with Standard Allowance' : 'Exceeds Allowed Limits'}
        </span>
        <div
          className={`text-2xl font-black ${
            compliance.isCompliant ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'
          }`}
        >
          {compliance.isCompliant ? 'Ready for Check-In / Boarding' : 'Baggage Notice'}
        </div>
        {compliance.issues.length > 0 && (
          <div className="space-y-1 text-xs text-rose-600 dark:text-rose-400 pt-1">
            {compliance.issues.map((iss, idx) => (
              <p key={idx}>• {iss}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 15. Travel Expense Splitter
// ==========================================
export const TravelExpenseSplitter: React.FC = () => {
  const [participants, setParticipants] = useState<ExpenseParticipant[]>([
    { name: 'Maya', paidAmount: 220 },
    { name: 'Leo', paidAmount: 80 },
    { name: 'Sarah', paidAmount: 0 }
  ]);
  const [newName, setNewName] = useState('');
  const [newPaid, setNewPaid] = useState<number>(0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setParticipants([...participants, { name: newName.trim(), paidAmount: newPaid }]);
    setNewName('');
    setNewPaid(0);
  };

  const handleRemove = (idx: number) => {
    setParticipants(participants.filter((_, i) => i !== idx));
  };

  const settlement = calculateEqualExpenseSettlement(participants);

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Traveler name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
        />
        <input
          type="number"
          placeholder="Amount paid ($)"
          min="0"
          step="0.01"
          value={newPaid || ''}
          onChange={(e) => setNewPaid(parseFloat(e.target.value) || 0)}
          className="w-full sm:w-36 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Group Members</span>
        {participants.map((p, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
          >
            <span className="font-semibold text-slate-800 dark:text-slate-200">{p.name}</span>
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-600 dark:text-slate-300">Paid: ${p.paidAmount}</span>
              <button onClick={() => handleRemove(idx)} className="text-slate-400 hover:text-rose-500">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700/60 pb-3">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400">Total Group Expense</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">${settlement.totalExpense}</div>
          </div>
          <div className="text-right">
            <span className="text-xs text-sky-600 dark:text-sky-400 font-bold block">
              ${settlement.perPersonShare} per person
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300 block">Settlement Transfers:</span>
          {settlement.transfers.length === 0 ? (
            <p className="text-slate-400">Everyone is fully settled.</p>
          ) : (
            settlement.transfers.map((t, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span>
                  <strong>{t.from}</strong> owes <strong>{t.to}</strong>
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">${t.amount}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
