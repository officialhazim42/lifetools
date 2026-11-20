/**
 * LifeTools — Home Calculators Mathematical Engine
 * Accurate, unit-tested client-side formulas for electricity tariffs,
 * water consumption, LPG cylinders, solar PV sizing, home broadband,
 * household budgets, roommate rent splits, and spatial room dimensions.
 */

import { UtilityTariffSlab } from '../../types/household';

export interface TieredElectricityResult {
  slabBreakdown: Array<{
    slabRange: string;
    unitsInSlab: number;
    rate: number;
    cost: number;
  }>;
  energyCharges: number;
  fixedCharges: number;
  fuelSurcharge: number;
  taxes: number;
  totalBill: number;
  averageRatePerKwh: number;
}

export function calculateTieredElectricityBill(
  totalKwh: number,
  slabs: UtilityTariffSlab[],
  fixedCharges: number = 0,
  fuelSurchargePercent: number = 0,
  taxPercent: number = 0
): TieredElectricityResult {
  let remainingUnits = Math.max(0, totalKwh);
  let totalEnergyCharges = 0;
  const slabBreakdown: TieredElectricityResult['slabBreakdown'] = [];

  for (let i = 0; i < slabs.length; i++) {
    const slab = slabs[i];
    const slabCapacity =
      slab.slabEnd !== null
        ? Math.max(0, slab.slabEnd - slab.slabStart)
        : Infinity;

    const unitsInThisSlab = Math.min(remainingUnits, slabCapacity);

    if (unitsInThisSlab > 0) {
      const slabCost = unitsInThisSlab * slab.ratePerUnit;
      totalEnergyCharges += slabCost;
      remainingUnits -= unitsInThisSlab;

      slabBreakdown.push({
        slabRange:
          slab.slabEnd !== null
            ? `${slab.slabStart + 1} - ${slab.slabEnd} kWh`
            : `${slab.slabStart + 1}+ kWh`,
        unitsInSlab: Math.round(unitsInThisSlab * 100) / 100,
        rate: slab.ratePerUnit,
        cost: Math.round(slabCost * 100) / 100
      });
    }

    if (remainingUnits <= 0) break;
  }

  const fuelSurcharge = (totalEnergyCharges * Math.max(0, fuelSurchargePercent)) / 100;
  const subtotal = totalEnergyCharges + fixedCharges + fuelSurcharge;
  const taxes = (subtotal * Math.max(0, taxPercent)) / 100;
  const totalBill = subtotal + taxes;
  const averageRate = totalKwh > 0 ? totalBill / totalKwh : 0;

  return {
    slabBreakdown,
    energyCharges: Math.round(totalEnergyCharges * 100) / 100,
    fixedCharges: Math.round(fixedCharges * 100) / 100,
    fuelSurcharge: Math.round(fuelSurcharge * 100) / 100,
    taxes: Math.round(taxes * 100) / 100,
    totalBill: Math.round(totalBill * 100) / 100,
    averageRatePerKwh: Math.round(averageRate * 100) / 100
  };
}

export interface ApplianceCostInput {
  name?: string;
  wattage: number;
  dailyHours: number;
  quantity?: number;
}

export function calculateApplianceEnergyCost(
  appliances: ApplianceCostInput[],
  ratePerKwh: number
) {
  let totalDailyKwh = 0;

  const itemized = appliances.map(app => {
    const qty = Math.max(1, app.quantity || 1);
    const dailyKwh = ((app.wattage * app.dailyHours) / 1000) * qty;
    totalDailyKwh += dailyKwh;

    const monthlyKwh = dailyKwh * 30;
    const yearlyKwh = dailyKwh * 365;

    return {
      name: app.name || 'Appliance',
      dailyKwh: Math.round(dailyKwh * 100) / 100,
      monthlyKwh: Math.round(monthlyKwh * 100) / 100,
      yearlyKwh: Math.round(yearlyKwh * 100) / 100,
      monthlyCost: Math.round(monthlyKwh * ratePerKwh * 100) / 100,
      yearlyCost: Math.round(yearlyKwh * ratePerKwh * 100) / 100
    };
  });

  const totalMonthlyKwh = totalDailyKwh * 30;
  const totalYearlyKwh = totalDailyKwh * 365;

  return {
    itemized,
    totalDailyKwh: Math.round(totalDailyKwh * 100) / 100,
    totalMonthlyKwh: Math.round(totalMonthlyKwh * 100) / 100,
    totalYearlyKwh: Math.round(totalYearlyKwh * 100) / 100,
    dailyCost: Math.round(totalDailyKwh * ratePerKwh * 100) / 100,
    monthlyCost: Math.round(totalMonthlyKwh * ratePerKwh * 100) / 100,
    yearlyCost: Math.round(totalYearlyKwh * ratePerKwh * 100) / 100
  };
}

export function calculateHouseholdWaterAudit(params: {
  residents: number;
  showersPerDay: number;
  minutesPerShower: number;
  showerFlowRateLpm?: number; // default 9.5 L/min
  toiletFlushesPerDay: number;
  litersPerFlush?: number; // default 6 L
  laundryLoadsPerWeek: number;
  litersPerLoad?: number; // default 60 L
  dishwasherRunsPerWeek: number;
  litersPerDishCycle?: number; // default 15 L
  outdoorMinutesPerWeek?: number;
  hoseFlowRateLpm?: number; // default 19 L/min
  leaksPerDayLiters?: number;
}) {
  const residents = Math.max(1, params.residents);
  const showerLpm = params.showerFlowRateLpm ?? 9.5;
  const flushLiters = params.litersPerFlush ?? 6;
  const laundryLiters = params.litersPerLoad ?? 60;
  const dishLiters = params.litersPerDishCycle ?? 15;
  const hoseLpm = params.hoseFlowRateLpm ?? 19;
  const leakLiters = params.leaksPerDayLiters ?? 0;

  const dailyShower = residents * params.showersPerDay * params.minutesPerShower * showerLpm;
  const dailyToilet = residents * params.toiletFlushesPerDay * flushLiters;
  const dailyLaundry = (params.laundryLoadsPerWeek * laundryLiters) / 7;
  const dailyDish = (params.dishwasherRunsPerWeek * dishLiters) / 7;
  const dailyOutdoor = ((params.outdoorMinutesPerWeek ?? 0) * hoseLpm) / 7;
  const dailyTotalLiters = dailyShower + dailyToilet + dailyLaundry + dailyDish + dailyOutdoor + leakLiters;

  const monthlyLiters = dailyTotalLiters * 30;
  const yearlyLiters = dailyTotalLiters * 365;

  // 1 Gallon (US) = 3.78541 Liters
  const dailyGallons = dailyTotalLiters / 3.78541;
  const monthlyGallons = monthlyLiters / 3.78541;

  return {
    dailyTotalLiters: Math.round(dailyTotalLiters),
    monthlyTotalLiters: Math.round(monthlyLiters),
    yearlyTotalLiters: Math.round(yearlyLiters),
    dailyGallons: Math.round(dailyGallons),
    monthlyGallons: Math.round(monthlyGallons),
    perCapitaDailyLiters: Math.round(dailyTotalLiters / residents),
    breakdown: {
      showerLiters: Math.round(dailyShower),
      toiletLiters: Math.round(dailyToilet),
      laundryLiters: Math.round(dailyLaundry),
      dishLiters: Math.round(dailyDish),
      outdoorLiters: Math.round(dailyOutdoor),
      leakLiters: Math.round(leakLiters)
    }
  };
}

export function calculateWaterBill(
  volumeUnits: number,
  unitType: 'kiloliters' | 'cubic_meters' | 'gallons_1000' = 'kiloliters',
  ratePerUnit: number = 1.5,
  sewageRatePercent: number = 25,
  fixedCharge: number = 5,
  taxPercent: number = 0
) {
  const waterCharge = Math.max(0, volumeUnits) * ratePerUnit;
  const sewageCharge = (waterCharge * Math.max(0, sewageRatePercent)) / 100;
  const subtotal = waterCharge + sewageCharge + fixedCharge;
  const tax = (subtotal * Math.max(0, taxPercent)) / 100;
  const total = subtotal + tax;

  return {
    volumeUnits,
    unitType,
    waterCharge: Math.round(waterCharge * 100) / 100,
    sewageCharge: Math.round(sewageCharge * 100) / 100,
    fixedCharge: Math.round(fixedCharge * 100) / 100,
    taxes: Math.round(tax * 100) / 100,
    totalBill: Math.round(total * 100) / 100
  };
}

export function calculateLpgConsumption(
  cylinderWeightKg: number = 14.2,
  dailyCookingHours: number = 2,
  activeBurners: number = 1,
  burnerBurnRateGramsPerHour: number = 150
) {
  const totalGasGrams = cylinderWeightKg * 1000;
  const dailyBurnGrams = Math.max(1, dailyCookingHours * activeBurners * burnerBurnRateGramsPerHour);
  const estimatedDays = Math.floor(totalGasGrams / dailyBurnGrams);
  const dailyCostKg = dailyBurnGrams / 1000;

  return {
    cylinderWeightKg,
    dailyBurnGrams: Math.round(dailyBurnGrams),
    dailyBurnKg: Math.round(dailyCostKg * 1000) / 1000,
    estimatedDaysLifespan: estimatedDays,
    weeksLifespan: Math.round((estimatedDays / 7) * 10) / 10
  };
}

export function calculateSolarSizing(
  monthlyKwh: number,
  peakSunHoursPerDay: number = 5.0,
  panelWattage: number = 400,
  systemEfficiencyFactor: number = 0.80
) {
  const dailyKwhNeeded = Math.max(0, monthlyKwh) / 30;
  // System kW = Daily kWh / (Peak Sun Hours * Efficiency)
  const requiredSystemKw = dailyKwhNeeded / (Math.max(1, peakSunHoursPerDay) * Math.max(0.5, systemEfficiencyFactor));
  const totalWatts = requiredSystemKw * 1000;
  const panelsCount = Math.ceil(totalWatts / Math.max(100, panelWattage));
  const actualSystemCapacityKw = (panelsCount * panelWattage) / 1000;

  // Approx 17.5 sq ft (1.63 sq m) per 400W solar panel
  const sqFtPerPanel = 18;
  const roofAreaSqFt = panelsCount * sqFtPerPanel;
  const roofAreaSqM = Math.round(roofAreaSqFt * 0.092903);

  const estimatedDailyGenerationKwh = actualSystemCapacityKw * peakSunHoursPerDay * systemEfficiencyFactor;
  const estimatedMonthlyGenerationKwh = estimatedDailyGenerationKwh * 30;

  return {
    dailyKwhNeeded: Math.round(dailyKwhNeeded * 10) / 10,
    requiredSystemKw: Math.round(requiredSystemKw * 100) / 100,
    panelsCount,
    panelWattage,
    actualSystemCapacityKw: Math.round(actualSystemCapacityKw * 100) / 100,
    roofAreaSqFt,
    roofAreaSqM,
    estimatedDailyGenerationKwh: Math.round(estimatedDailyGenerationKwh * 10) / 10,
    estimatedMonthlyGenerationKwh: Math.round(estimatedMonthlyGenerationKwh)
  };
}

export function calculateSolarRoi(
  systemInstallationCost: number,
  monthlyElectricitySavings: number,
  annualMaintenanceCost: number = 50,
  netMeteringSellRatePerKwh: number = 0,
  annualExcessKwhSold: number = 0,
  lifespanYears: number = 25
) {
  const annualBillSavings = monthlyElectricitySavings * 12;
  const annualSellRevenue = annualExcessKwhSold * netMeteringSellRatePerKwh;
  const netAnnualSavings = annualBillSavings + annualSellRevenue - annualMaintenanceCost;

  const paybackPeriodYears =
    netAnnualSavings > 0 ? systemInstallationCost / netAnnualSavings : Infinity;

  const cumulative25YearSavings = netAnnualSavings * lifespanYears - systemInstallationCost;
  const roiPercent =
    systemInstallationCost > 0
      ? (cumulative25YearSavings / systemInstallationCost) * 100
      : 0;

  return {
    netAnnualSavings: Math.round(netAnnualSavings),
    paybackPeriodYears: Math.round(paybackPeriodYears * 10) / 10,
    cumulative25YearSavings: Math.round(cumulative25YearSavings),
    roiPercent: Math.round(roiPercent)
  };
}

export function calculateBroadbandRequirement(params: {
  familyMembers: number;
  devicesConnected: number;
  hours4kStreamingPerDay: number;
  hoursHdStreamingPerDay: number;
  hoursVideoCallsPerDay: number;
  gamingHoursPerDay: number;
}) {
  // Approximate data rates:
  // 4K: 7 GB/hr, HD: 3 GB/hr, Video Call: 1.5 GB/hr, Gaming: 0.1 GB/hr (data) + low latency
  const dailyGb =
    params.hours4kStreamingPerDay * 7 +
    params.hoursHdStreamingPerDay * 3 +
    params.hoursVideoCallsPerDay * 1.5 +
    params.gamingHoursPerDay * 0.2 +
    params.devicesConnected * 0.1; // background IoT

  const monthlyGb = dailyGb * 30;

  // Bandwidth recommendations:
  // Baseline 25 Mbps + 25 Mbps per 4K stream + 10 Mbps per HD/Meeting + 5 Mbps per active user
  const recommendedMbps = Math.max(
    30,
    params.familyMembers * 15 +
      params.hours4kStreamingPerDay * 10 +
      params.hoursVideoCallsPerDay * 10
  );

  let planTier = 'Basic (30 - 50 Mbps)';
  if (recommendedMbps > 300) planTier = 'Gigabit / Heavy Power User (500+ Mbps)';
  else if (recommendedMbps > 150) planTier = 'Pro / High-Density Smart Home (200 - 300 Mbps)';
  else if (recommendedMbps > 75) planTier = 'Family / Streaming & WFH (100 Mbps)';

  return {
    dailyGb: Math.round(dailyGb * 10) / 10,
    monthlyGb: Math.round(monthlyGb),
    recommendedSpeedMbps: Math.ceil(recommendedMbps / 25) * 25,
    recommendedPlanTier: planTier
  };
}

export function calculateRoomDimensions(
  length: number,
  width: number,
  height: number = 9,
  unit: 'feet' | 'meters' = 'feet'
) {
  const floorArea = length * width;
  const perimeter = 2 * (length + width);
  const wallArea = perimeter * height;
  const volume = length * width * height;

  // HVAC BTU Rule of Thumb: 20 BTU per sq ft for 8-9ft ceiling
  const btuNeeded = unit === 'feet' ? floorArea * 25 : floorArea * 10.764 * 25;
  const tonCapacity = btuNeeded / 12000;

  // CFM for air purifier (4 Air Changes per Hour)
  const volumeCuFt = unit === 'feet' ? volume : volume * 35.3147;
  const recommendedCfm = (volumeCuFt * 4) / 60;

  return {
    length,
    width,
    height,
    unit,
    floorArea: Math.round(floorArea * 100) / 100,
    wallArea: Math.round(wallArea * 100) / 100,
    volume: Math.round(volume * 100) / 100,
    perimeter: Math.round(perimeter * 100) / 100,
    coolingBtu: Math.round(btuNeeded),
    coolingTons: Math.round(tonCapacity * 10) / 10,
    airChangesCfm: Math.round(recommendedCfm)
  };
}

export function calculatePaintCoverage(
  roomLength: number,
  roomWidth: number,
  roomHeight: number,
  doorsCount: number = 1,
  windowsCount: number = 2,
  includeCeiling: boolean = true,
  coats: number = 2,
  coverageSqFtPerLiter: number = 100 // Standard interior emulsion: ~100 sq ft per liter
) {
  const perimeter = 2 * (roomLength + roomWidth);
  const grossWallArea = perimeter * roomHeight;
  const doorDeduction = doorsCount * 21; // 7ft x 3ft standard door = 21 sq ft
  const windowDeduction = windowsCount * 15; // 3ft x 5ft window = 15 sq ft
  const netWallArea = Math.max(0, grossWallArea - doorDeduction - windowDeduction);
  const ceilingArea = includeCeiling ? roomLength * roomWidth : 0;
  const totalAreaToPaint = netWallArea + ceilingArea;

  const totalAreaWithCoats = totalAreaToPaint * Math.max(1, coats);
  const litersNeeded = totalAreaWithCoats / Math.max(10, coverageSqFtPerLiter);
  // 1 US Gallon = 3.78541 Liters
  const gallonsNeeded = litersNeeded / 3.78541;
  const primerLiters = totalAreaToPaint / (coverageSqFtPerLiter * 1.2);

  return {
    grossWallArea: Math.round(grossWallArea),
    netWallArea: Math.round(netWallArea),
    ceilingArea: Math.round(ceilingArea),
    totalAreaToPaint: Math.round(totalAreaToPaint),
    litersNeeded: Math.round(litersNeeded * 10) / 10,
    gallonsNeeded: Math.round(gallonsNeeded * 10) / 10,
    primerLitersNeeded: Math.round(primerLiters * 10) / 10
  };
}

export function calculateWallpaper(
  roomLength: number,
  roomWidth: number,
  roomHeight: number,
  doorsCount: number = 1,
  windowsCount: number = 2,
  rollWidthInches: number = 21,
  rollLengthFeet: number = 33,
  patternRepeatInches: number = 0,
  wastagePercent: number = 10
) {
  const perimeter = 2 * (roomLength + roomWidth);
  const grossArea = perimeter * roomHeight;
  const deductions = doorsCount * 21 + windowsCount * 15;
  const netWallArea = Math.max(0, grossArea - deductions);

  // Single roll area in sq ft
  const rollWidthFeet = rollWidthInches / 12;
  const singleRollArea = rollWidthFeet * rollLengthFeet;

  // Account for pattern repeat and cut drop loss
  let usableRollArea = singleRollArea;
  if (patternRepeatInches > 0) {
    const stripsPerRoll = Math.floor(rollLengthFeet / (roomHeight + patternRepeatInches / 12));
    usableRollArea = stripsPerRoll * rollWidthFeet * roomHeight;
  }

  const effectiveAreaWithWastage = netWallArea * (1 + wastagePercent / 100);
  const rollsNeeded = Math.ceil(effectiveAreaWithWastage / Math.max(1, usableRollArea));

  return {
    netWallArea: Math.round(netWallArea),
    singleRollArea: Math.round(singleRollArea * 10) / 10,
    usableRollArea: Math.round(usableRollArea * 10) / 10,
    rollsNeeded: Math.max(1, rollsNeeded),
    wasteArea: Math.round((rollsNeeded * singleRollArea - netWallArea) * 10) / 10
  };
}

export interface RoommateRoomInput {
  id: string;
  tenantName: string;
  roomAreaSqFt: number;
  hasPrivateBathroom?: boolean;
  hasBalcony?: boolean;
  hasParking?: boolean;
}

export function calculateRentSplit(
  totalRent: number,
  rooms: RoommateRoomInput[],
  privateBathPremium: number = 75,
  balconyPremium: number = 40,
  parkingPremium: number = 50
) {
  if (rooms.length === 0) return { itemized: [], totalRent };

  const totalSqFt = rooms.reduce((sum, r) => sum + Math.max(1, r.roomAreaSqFt), 0);

  // Total amenity premiums
  const totalAmenityCharges = rooms.reduce((sum, r) => {
    let fee = 0;
    if (r.hasPrivateBathroom) fee += privateBathPremium;
    if (r.hasBalcony) fee += balconyPremium;
    if (r.hasParking) fee += parkingPremium;
    return sum + fee;
  }, 0);

  const baseRentPool = Math.max(0, totalRent - totalAmenityCharges);

  const itemized = rooms.map(room => {
    const sqFtRatio = room.roomAreaSqFt / totalSqFt;
    const baseShare = baseRentPool * sqFtRatio;
    let amenityShare = 0;
    if (room.hasPrivateBathroom) amenityShare += privateBathPremium;
    if (room.hasBalcony) amenityShare += balconyPremium;
    if (room.hasParking) amenityShare += parkingPremium;

    const totalShare = baseShare + amenityShare;
    const percentage = (totalShare / totalRent) * 100;

    return {
      id: room.id,
      tenantName: room.tenantName,
      roomAreaSqFt: room.roomAreaSqFt,
      baseShare: Math.round(baseShare * 100) / 100,
      amenityShare: Math.round(amenityShare * 100) / 100,
      totalShare: Math.round(totalShare * 100) / 100,
      percentage: Math.round(percentage * 10) / 10
    };
  });

  return {
    itemized,
    totalRent
  };
}
