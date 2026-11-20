/**
 * Travel, Navigation & Financial Calculation Utilities
 * Mathematical formulas for travel distances, fuel cost, fuel economy,
 * trip costs, budgets, road trip splitting, average speed, flight duration,
 * time zone conversion, jet lag recovery, offline currency reference, and baggage allowances.
 */

// ==========================================
// 1. Distance & Unit Conversions
// ==========================================
export function convertDistance(
  value: number,
  from: 'km' | 'miles' | 'nm',
  to: 'km' | 'miles' | 'nm'
): number {
  if (value < 0) return 0;
  if (from === to) return value;

  // Convert to kilometers first
  let km = value;
  if (from === 'miles') km = value * 1.609344;
  else if (from === 'nm') km = value * 1.852;

  // Convert to target
  let result = km;
  if (to === 'miles') result = km / 1.609344;
  else if (to === 'nm') result = km / 1.852;

  return Math.round(result * 100) / 100;
}

// ==========================================
// 2. Fuel Cost Calculator
// ==========================================
export interface FuelCostResult {
  totalFuelNeeded: number; // liters or gallons
  totalCost: number;
  costPerDistanceUnit: number;
  costPerPerson: number;
}

export function calculateTripFuelCost(params: {
  distance: number;
  distanceUnit: 'km' | 'miles';
  consumption: number; // e.g., 8 L/100km or 30 MPG
  consumptionType: 'l_per_100km' | 'mpg_us' | 'mpg_uk' | 'km_per_l';
  fuelPricePerUnit: number; // price per liter or gallon
  travelersCount?: number;
}): FuelCostResult {
  const { distance, consumption, consumptionType, fuelPricePerUnit, travelersCount = 1 } = params;
  if (distance <= 0 || consumption <= 0 || fuelPricePerUnit <= 0) {
    return { totalFuelNeeded: 0, totalCost: 0, costPerDistanceUnit: 0, costPerPerson: 0 };
  }

  let totalFuelUnits = 0;
  switch (consumptionType) {
    case 'l_per_100km':
      totalFuelUnits = (distance / 100) * consumption;
      break;
    case 'km_per_l':
      totalFuelUnits = distance / consumption;
      break;
    case 'mpg_us':
    case 'mpg_uk':
      totalFuelUnits = distance / consumption;
      break;
  }

  const totalCost = Math.round(totalFuelUnits * fuelPricePerUnit * 100) / 100;
  const costPerDist = Math.round((totalCost / distance) * 100) / 100;
  const safeTravelers = Math.max(1, travelersCount);
  const costPerPerson = Math.round((totalCost / safeTravelers) * 100) / 100;

  return {
    totalFuelNeeded: Math.round(totalFuelUnits * 10) / 10,
    totalCost,
    costPerDistanceUnit: costPerDist,
    costPerPerson
  };
}

// ==========================================
// 3. Vehicle Fuel Mileage Converter
// ==========================================
export interface FuelMileageConversions {
  mpgUs: number;
  mpgUk: number;
  kmPerLiter: number;
  litersPer100Km: number;
}

export function convertFuelMileage(
  value: number,
  type: 'mpg_us' | 'mpg_uk' | 'km_per_l' | 'l_per_100km'
): FuelMileageConversions | null {
  if (value <= 0) return null;

  let kmPerL = 0;

  if (type === 'km_per_l') kmPerL = value;
  else if (type === 'l_per_100km') kmPerL = 100 / value;
  else if (type === 'mpg_us') kmPerL = value * 0.425144;
  else if (type === 'mpg_uk') kmPerL = value * 0.354006;

  const mpgUs = kmPerL / 0.425144;
  const mpgUk = kmPerL / 0.354006;
  const lPer100Km = 100 / kmPerL;

  return {
    mpgUs: Math.round(mpgUs * 10) / 10,
    mpgUk: Math.round(mpgUk * 10) / 10,
    kmPerLiter: Math.round(kmPerL * 10) / 10,
    litersPer100Km: Math.round(lPer100Km * 10) / 10
  };
}

// ==========================================
// 4. Trip Cost Calculator
// ==========================================
export interface ComprehensiveTripCost {
  transportCost: number;
  lodgingCost: number;
  foodCost: number;
  activitiesCost: number;
  contingencyCost: number;
  grandTotal: number;
  costPerTraveler: number;
  costPerDay: number;
}

export function calculateComprehensiveTripCost(params: {
  fuelOrTransitCost: number;
  tollsAndParking: number;
  nightsCount: number;
  nightlyLodgingCost: number;
  daysCount: number;
  dailyFoodPerPerson: number;
  activitiesTotal: number;
  contingencyPercent: number; // e.g. 10%
  travelersCount: number;
}): ComprehensiveTripCost {
  const {
    fuelOrTransitCost,
    tollsAndParking,
    nightsCount,
    nightlyLodgingCost,
    daysCount,
    dailyFoodPerPerson,
    activitiesTotal,
    contingencyPercent,
    travelersCount
  } = params;

  const safeTravelers = Math.max(1, travelersCount);
  const safeDays = Math.max(1, daysCount);

  const transport = fuelOrTransitCost + tollsAndParking;
  const lodging = Math.max(0, nightsCount) * nightlyLodgingCost;
  const food = safeDays * dailyFoodPerPerson * safeTravelers;
  const activities = activitiesTotal;

  const subtotal = transport + lodging + food + activities;
  const contingency = (subtotal * Math.max(0, contingencyPercent)) / 100;
  const grandTotal = Math.round((subtotal + contingency) * 100) / 100;

  return {
    transportCost: Math.round(transport * 100) / 100,
    lodgingCost: Math.round(lodging * 100) / 100,
    foodCost: Math.round(food * 100) / 100,
    activitiesCost: Math.round(activities * 100) / 100,
    contingencyCost: Math.round(contingency * 100) / 100,
    grandTotal,
    costPerTraveler: Math.round((grandTotal / safeTravelers) * 100) / 100,
    costPerDay: Math.round((grandTotal / safeDays) * 100) / 100
  };
}

// ==========================================
// 5. Travel Time & Speed Calculators
// ==========================================
export function calculateTravelTime(
  distance: number,
  averageSpeed: number,
  stopIntervalHours: number = 2.5,
  stopDurationMinutes: number = 20
): {
  drivingHours: number;
  drivingMinutes: number;
  stopsCount: number;
  stopsTotalMinutes: number;
  totalTripHours: number;
  totalTripMinutes: number;
  formattedTotalTime: string;
} {
  if (distance <= 0 || averageSpeed <= 0) {
    return {
      drivingHours: 0,
      drivingMinutes: 0,
      stopsCount: 0,
      stopsTotalMinutes: 0,
      totalTripHours: 0,
      totalTripMinutes: 0,
      formattedTotalTime: '0h 0m'
    };
  }

  const pureDrivingTotalHours = distance / averageSpeed;
  const stopsCount =
    stopIntervalHours > 0 ? Math.floor(pureDrivingTotalHours / stopIntervalHours) : 0;
  const stopsTotalMinutes = stopsCount * Math.max(0, stopDurationMinutes);

  const drivingTotalMinutes = Math.round(pureDrivingTotalHours * 60);
  const grandTotalMinutes = drivingTotalMinutes + stopsTotalMinutes;

  const totalTripHours = Math.floor(grandTotalMinutes / 60);
  const totalTripMins = grandTotalMinutes % 60;

  return {
    drivingHours: Math.floor(drivingTotalMinutes / 60),
    drivingMinutes: drivingTotalMinutes % 60,
    stopsCount,
    stopsTotalMinutes,
    totalTripHours,
    totalTripMinutes: totalTripMins,
    formattedTotalTime: `${totalTripHours}h ${totalTripMins}m`
  };
}

export function calculateAverageSpeed(
  distance: number,
  hours: number,
  minutes: number
): { speed: number; formatted: string } {
  const totalHours = hours + minutes / 60;
  if (distance <= 0 || totalHours <= 0) return { speed: 0, formatted: '0' };
  const speed = Math.round((distance / totalHours) * 10) / 10;
  return { speed, formatted: speed.toString() };
}

// ==========================================
// 6. Flight Duration Calculator
// ==========================================
export function calculateFlightDuration(
  distanceKm: number,
  cruisingSpeedKmh: number = 850,
  taxiClimbBufferMinutes: number = 35
): {
  airTimeHours: number;
  airTimeMinutes: number;
  totalGateToGateMinutes: number;
  formattedDuration: string;
} {
  if (distanceKm <= 0 || cruisingSpeedKmh <= 0) {
    return {
      airTimeHours: 0,
      airTimeMinutes: 0,
      totalGateToGateMinutes: 0,
      formattedDuration: '0h 0m'
    };
  }

  const pureAirHours = distanceKm / cruisingSpeedKmh;
  const airMinutes = Math.round(pureAirHours * 60);
  const totalGateToGateMinutes = airMinutes + taxiClimbBufferMinutes;

  const totalH = Math.floor(totalGateToGateMinutes / 60);
  const totalM = totalGateToGateMinutes % 60;

  return {
    airTimeHours: Math.floor(airMinutes / 60),
    airTimeMinutes: airMinutes % 60,
    totalGateToGateMinutes,
    formattedDuration: `${totalH}h ${totalM}m`
  };
}

// ==========================================
// 7. Jet Lag Recovery Calculator
// ==========================================
export interface JetLagRecoveryPlan {
  timeZonesCrossed: number;
  direction: 'east' | 'west';
  recoveryDays: number;
  adaptationTips: string[];
}

export function calculateJetLag(
  originOffsetUtcHours: number,
  destOffsetUtcHours: number
): JetLagRecoveryPlan {
  const diff = destOffsetUtcHours - originOffsetUtcHours;
  const timeZonesCrossed = Math.abs(diff);
  const direction: 'east' | 'west' = diff >= 0 ? 'east' : 'west';

  // Eastward travel requires ~1 day per time zone; westward requires ~0.7 days per zone
  const recoveryDays =
    direction === 'east'
      ? Math.max(1, Math.round(timeZonesCrossed * 1.0))
      : Math.max(1, Math.round(timeZonesCrossed * 0.7));

  const adaptationTips: string[] = [];
  if (timeZonesCrossed <= 2) {
    adaptationTips.push('Minimal disruption expected. Maintain normal wake-up times.');
  } else if (direction === 'east') {
    adaptationTips.push(
      'Traveling East shortens your day. Seek bright morning sunlight immediately upon arrival.'
    );
    adaptationTips.push('Avoid caffeine after 14:00 and shift bedtime earlier by 1-2 hours.');
    adaptationTips.push('Stay active outdoors during the morning to accelerate circadian phase advance.');
  } else {
    adaptationTips.push(
      'Traveling West lengthens your day. Seek afternoon and evening light to delay sleep onset.'
    );
    adaptationTips.push('Resist the urge to sleep early; hold out until at least 21:30 local time.');
    adaptationTips.push('Have a light evening dinner and stay hydrated.');
  }

  return {
    timeZonesCrossed,
    direction,
    recoveryDays,
    adaptationTips
  };
}

// ==========================================
// 8. Offline Reference Currency Converter
// ==========================================
export const OFFLINE_BASELINE_RATES_USD: Record<string, { name: string; rateAgainstUsd: number; symbol: string }> = {
  USD: { name: 'US Dollar', rateAgainstUsd: 1.0, symbol: '$' },
  EUR: { name: 'Euro', rateAgainstUsd: 0.92, symbol: '€' },
  GBP: { name: 'British Pound', rateAgainstUsd: 0.79, symbol: '£' },
  INR: { name: 'Indian Rupee', rateAgainstUsd: 84.4, symbol: '₹' },
  JPY: { name: 'Japanese Yen', rateAgainstUsd: 154.5, symbol: '¥' },
  CAD: { name: 'Canadian Dollar', rateAgainstUsd: 1.39, symbol: 'CA$' },
  AUD: { name: 'Australian Dollar', rateAgainstUsd: 1.53, symbol: 'A$' },
  CHF: { name: 'Swiss Franc', rateAgainstUsd: 0.88, symbol: 'CHF' },
  AED: { name: 'UAE Dirham', rateAgainstUsd: 3.67, symbol: 'AED' },
  SGD: { name: 'Singapore Dollar', rateAgainstUsd: 1.34, symbol: 'S$' },
  CNY: { name: 'Chinese Yuan', rateAgainstUsd: 7.23, symbol: '¥' },
  THB: { name: 'Thai Baht', rateAgainstUsd: 34.6, symbol: '฿' },
  TRY: { name: 'Turkish Lira', rateAgainstUsd: 34.5, symbol: '₺' }
};

export function convertCurrencyOffline(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  customExchangeRate?: number
): {
  convertedAmount: number;
  rateUsed: number;
  isCustomRate: boolean;
  disclaimer: string;
} {
  if (amount <= 0) {
    return {
      convertedAmount: 0,
      rateUsed: 1,
      isCustomRate: false,
      disclaimer: 'Amount must be greater than zero.'
    };
  }

  if (customExchangeRate && customExchangeRate > 0) {
    const converted = Math.round(amount * customExchangeRate * 100) / 100;
    return {
      convertedAmount: converted,
      rateUsed: customExchangeRate,
      isCustomRate: true,
      disclaimer: 'Calculated using your custom entered exchange rate.'
    };
  }

  const fromData = OFFLINE_BASELINE_RATES_USD[fromCurrency] || { rateAgainstUsd: 1.0 };
  const toData = OFFLINE_BASELINE_RATES_USD[toCurrency] || { rateAgainstUsd: 1.0 };

  // Convert via USD anchor
  const amountInUsd = amount / fromData.rateAgainstUsd;
  const result = amountInUsd * toData.rateAgainstUsd;
  const rateUsed = Math.round((toData.rateAgainstUsd / fromData.rateAgainstUsd) * 10000) / 10000;

  return {
    convertedAmount: Math.round(result * 100) / 100,
    rateUsed,
    isCustomRate: false,
    disclaimer:
      'Reference Offline Rate: Exchange rates fluctuate continuously. For financial or banking transactions, verify live bank rates or enter your actual exchange rate above.'
  };
}

// ==========================================
// 9. Luggage Weight Converter
// ==========================================
export interface LuggageWeightConversions {
  kg: number;
  lbs: number;
  oz: number;
  stone: number;
}

export function convertLuggageWeight(
  value: number,
  unit: 'kg' | 'lbs' | 'oz' | 'stone'
): LuggageWeightConversions {
  if (value < 0) return { kg: 0, lbs: 0, oz: 0, stone: 0 };

  let kg = 0;
  if (unit === 'kg') kg = value;
  else if (unit === 'lbs') kg = value * 0.45359237;
  else if (unit === 'oz') kg = (value * 0.45359237) / 16;
  else if (unit === 'stone') kg = value * 6.35029318;

  const lbs = kg / 0.45359237;
  const oz = lbs * 16;
  const stone = kg / 6.35029318;

  return {
    kg: Math.round(kg * 10) / 10,
    lbs: Math.round(lbs * 10) / 10,
    oz: Math.round(oz * 10) / 10,
    stone: Math.round(stone * 10) / 10
  };
}

// ==========================================
// 10. Baggage Allowance Calculator
// ==========================================
export interface AirlineBaggagePolicy {
  airlineName: string;
  carryOnMaxKg: number;
  carryOnMaxDimensionsCm: [number, number, number]; // L, W, H
  checkedMaxKg: number;
  checkedLinearCm: number; // L + W + H (typically 158 cm / 62 in)
}

export const AIRLINE_BAGGAGE_POLICIES: AirlineBaggagePolicy[] = [
  { airlineName: 'Standard International (IATA)', carryOnMaxKg: 8, carryOnMaxDimensionsCm: [55, 40, 20], checkedMaxKg: 23, checkedLinearCm: 158 },
  { airlineName: 'Delta Air Lines', carryOnMaxKg: 10, carryOnMaxDimensionsCm: [56, 35, 23], checkedMaxKg: 23, checkedLinearCm: 158 },
  { airlineName: 'United Airlines', carryOnMaxKg: 10, carryOnMaxDimensionsCm: [56, 35, 22], checkedMaxKg: 23, checkedLinearCm: 158 },
  { airlineName: 'Emirates', carryOnMaxKg: 7, carryOnMaxDimensionsCm: [55, 38, 20], checkedMaxKg: 25, checkedLinearCm: 150 },
  { airlineName: 'British Airways', carryOnMaxKg: 23, carryOnMaxDimensionsCm: [56, 45, 25], checkedMaxKg: 23, checkedLinearCm: 158 },
  { airlineName: 'Ryanair (Priority)', carryOnMaxKg: 10, carryOnMaxDimensionsCm: [55, 40, 20], checkedMaxKg: 20, checkedLinearCm: 149 },
  { airlineName: 'Air India', carryOnMaxKg: 8, carryOnMaxDimensionsCm: [55, 35, 25], checkedMaxKg: 23, checkedLinearCm: 158 },
  { airlineName: 'Lufthansa', carryOnMaxKg: 8, carryOnMaxDimensionsCm: [55, 40, 23], checkedMaxKg: 23, checkedLinearCm: 158 }
];

export function checkBaggageCompliance(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  weightKg: number,
  type: 'carry_on' | 'checked',
  policy: AirlineBaggagePolicy = AIRLINE_BAGGAGE_POLICIES[0]
): {
  isCompliant: boolean;
  issues: string[];
  linearDimensionsCm: number;
  maxWeightAllowed: number;
} {
  const issues: string[] = [];
  const linear = lengthCm + widthCm + heightCm;

  if (type === 'carry_on') {
    if (weightKg > policy.carryOnMaxKg) {
      issues.push(`Overweight: Bag is ${weightKg}kg (maximum permitted is ${policy.carryOnMaxKg}kg).`);
    }
    const [maxL, maxW, maxH] = policy.carryOnMaxDimensionsCm;
    if (lengthCm > maxL || widthCm > maxW || heightCm > maxH) {
      issues.push(
        `Oversized dimensions: ${lengthCm}×${widthCm}×${heightCm} cm exceeds limit of ${maxL}×${maxW}×${maxH} cm.`
      );
    }
    return {
      isCompliant: issues.length === 0,
      issues,
      linearDimensionsCm: linear,
      maxWeightAllowed: policy.carryOnMaxKg
    };
  } else {
    if (weightKg > policy.checkedMaxKg) {
      issues.push(`Overweight: Checked bag is ${weightKg}kg (standard free allowance is ${policy.checkedMaxKg}kg). Heavy bag fees may apply.`);
    }
    if (linear > policy.checkedLinearCm) {
      issues.push(`Oversized: Total linear dimensions (${linear} cm) exceed standard ${policy.checkedLinearCm} cm (62 inches).`);
    }
    return {
      isCompliant: issues.length === 0,
      issues,
      linearDimensionsCm: linear,
      maxWeightAllowed: policy.checkedMaxKg
    };
  }
}

// ==========================================
// 11. Travel Expense Splitter (Settlement Algorithm)
// ==========================================
export interface ExpenseParticipant {
  name: string;
  paidAmount: number;
}

export interface SettlementTransfer {
  from: string;
  to: string;
  amount: number;
}

export function calculateEqualExpenseSettlement(
  participants: ExpenseParticipant[]
): {
  totalExpense: number;
  perPersonShare: number;
  transfers: SettlementTransfer[];
} {
  if (participants.length === 0) {
    return { totalExpense: 0, perPersonShare: 0, transfers: [] };
  }

  const totalExpense = participants.reduce((sum, p) => sum + p.paidAmount, 0);
  const perPersonShare = Math.round((totalExpense / participants.length) * 100) / 100;

  // Calculate net balances: positive = is owed money; negative = owes money
  const balances = participants.map((p) => ({
    name: p.name,
    balance: Math.round((p.paidAmount - perPersonShare) * 100) / 100
  }));

  const debtors = balances.filter((b) => b.balance < -0.01).map((b) => ({ ...b, balance: -b.balance }));
  const creditors = balances.filter((b) => b.balance > 0.01).map((b) => ({ ...b }));

  const transfers: SettlementTransfer[] = [];

  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const amount = Math.min(debtor.balance, creditor.balance);
    if (amount > 0.01) {
      transfers.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(amount * 100) / 100
      });
    }

    debtor.balance -= amount;
    creditor.balance -= amount;

    if (debtor.balance <= 0.01) dIdx++;
    if (creditor.balance <= 0.01) cIdx++;
  }

  return {
    totalExpense: Math.round(totalExpense * 100) / 100,
    perPersonShare,
    transfers
  };
}
