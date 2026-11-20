import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  calculateTieredElectricityBill,
  calculateApplianceEnergyCost,
  calculateHouseholdWaterAudit,
  calculateWaterBill,
  calculateLpgConsumption,
  calculateSolarSizing,
  calculateSolarRoi,
  calculateBroadbandRequirement,
  calculateRoomDimensions,
  calculatePaintCoverage,
  calculateWallpaper,
  calculateRentSplit
} from '../utils/household/homeCalculators';
import {
  calculateConcreteVolume,
  calculateBricks,
  calculateTiles,
  calculatePlaster,
  calculateRoofing,
  calculateStaircaseGeometry,
  estimateConstructionCost
} from '../utils/household/constructionCalculators';
import {
  convertPropertyArea,
  calculatePropertyPrice,
  calculateRegistrationExpenses,
  calculateRentalYield,
  calculateMortgagePiti,
  calculateLoanAffordability,
  calculatePropertyInvestment,
  calculateRentVsBuy
} from '../utils/household/propertyCalculators';
import { householdDB } from '../utils/householdDB';
import {
  HomeElectricityBillEstimator,
  RoomAreaCalculator
} from '../components/tools/household/HomeCalculatorTools';
import { ConcreteCalculator } from '../components/tools/household/ConstructionCalculatorTools';
import { HouseholdChorePlanner } from '../components/tools/household/HomeOrganizationTools';
import { PropertyAreaConverter } from '../components/tools/household/PropertyRentalTools';

describe('LifeTools Home, Household & Property Utilities Suite', () => {
  describe('1. Home Utility Calculators Engine', () => {
    it('calculates tiered electricity bills across tariff slabs accurately', () => {
      const slabs = [
        { slabStart: 0, slabEnd: 100, ratePerUnit: 0.10 },
        { slabStart: 100, slabEnd: 300, ratePerUnit: 0.15 },
        { slabStart: 300, slabEnd: null, ratePerUnit: 0.20 }
      ];

      // For 350 kWh:
      // First 100 kWh @ 0.10 = $10.00
      // Next 200 kWh @ 0.15 = $30.00
      // Remaining 50 kWh @ 0.20 = $10.00
      // Energy = $50.00, Fixed = $10, Fuel 5% of energy = $2.50, Subtotal = $62.50, Tax 8% = $5.00, Total = $67.50
      const res = calculateTieredElectricityBill(350, slabs, 10, 5, 8);
      expect(res.energyCharges).toBe(50);
      expect(res.fixedCharges).toBe(10);
      expect(res.fuelSurcharge).toBe(2.5);
      expect(res.taxes).toBe(5);
      expect(res.totalBill).toBe(67.5);
      expect(res.averageRatePerKwh).toBe(0.19);
    });

    it('calculates appliance energy consumption and running costs correctly', () => {
      const appliances = [
        { name: 'AC', wattage: 1500, dailyHours: 8, quantity: 1 } // 12 kWh/day
      ];
      const res = calculateApplianceEnergyCost(appliances, 0.15);
      expect(res.totalDailyKwh).toBe(12);
      expect(res.totalMonthlyKwh).toBe(360);
      expect(res.totalYearlyKwh).toBe(4380);
      expect(res.dailyCost).toBe(1.8);
      expect(res.monthlyCost).toBe(54);
    });

    it('audits household water usage per capita and breakdowns correctly', () => {
      const audit = calculateHouseholdWaterAudit({
        residents: 2,
        showersPerDay: 1,
        minutesPerShower: 8,
        showerFlowRateLpm: 10, // 2 * 1 * 8 * 10 = 160 L
        toiletFlushesPerDay: 5,
        litersPerFlush: 6, // 2 * 5 * 6 = 60 L
        laundryLoadsPerWeek: 7,
        litersPerLoad: 70, // (7 * 70)/7 = 70 L/day
        dishwasherRunsPerWeek: 7,
        litersPerDishCycle: 14 // 14 L/day
      });
      // Daily total: 160 + 60 + 70 + 14 = 304 Liters
      expect(audit.dailyTotalLiters).toBe(304);
      expect(audit.perCapitaDailyLiters).toBe(152);
      expect(audit.monthlyTotalLiters).toBe(9120);
    });

    it('calculates tiered water utility bills with sewage and fixed fees', () => {
      const bill = calculateWaterBill(20, 'kiloliters', 2.0, 25, 10, 5);
      // Water: 20 * 2 = $40. Sewage: 25% of 40 = $10. Fixed: $10. Subtotal: $60. Tax 5%: $3. Total: $63
      expect(bill.waterCharge).toBe(40);
      expect(bill.sewageCharge).toBe(10);
      expect(bill.fixedCharge).toBe(10);
      expect(bill.taxes).toBe(3);
      expect(bill.totalBill).toBe(63);
    });

    it('estimates LPG cylinder lifespan and daily burn rate accurately', () => {
      // 14.2 kg = 14,200g. 2 hours * 1 burner * 150g/hr = 300g/day. Days = floor(14200 / 300) = 47 days
      const res = calculateLpgConsumption(14.2, 2, 1, 150);
      expect(res.dailyBurnGrams).toBe(300);
      expect(res.estimatedDaysLifespan).toBe(47);
      expect(res.weeksLifespan).toBe(6.7);
    });

    it('calculates rooftop solar panel requirements and roof area correctly', () => {
      // Monthly 600 kWh -> 20 kWh/day. Sun hours: 5, Efficiency: 0.8 -> Required kW = 20 / 4 = 5 kW.
      // Panel 400W -> 5000 / 400 = 13 panels (ceil 12.5) -> Actual 5.2 kW.
      const solar = calculateSolarSizing(600, 5.0, 400, 0.8);
      expect(solar.dailyKwhNeeded).toBe(20);
      expect(solar.requiredSystemKw).toBe(5);
      expect(solar.panelsCount).toBe(13);
      expect(solar.actualSystemCapacityKw).toBe(5.2);
      expect(solar.roofAreaSqFt).toBe(234); // 13 * 18
    });

    it('computes solar financial ROI and payback period accurately', () => {
      // Install: $8,000, Monthly savings: $100 ($1200/yr), Maint: $0. Net annual: $1200.
      // Payback: 8000 / 1200 = 6.7 yrs. 25-yr net: 25 * 1200 - 8000 = $22,000.
      const roi = calculateSolarRoi(8000, 100, 0, 0, 0, 25);
      expect(roi.paybackPeriodYears).toBe(6.7);
      expect(roi.cumulative25YearSavings).toBe(22000);
      expect(roi.roiPercent).toBe(275);
    });

    it('estimates home broadband bandwidth and monthly data usage', () => {
      const net = calculateBroadbandRequirement({
        familyMembers: 3,
        devicesConnected: 10,
        hours4kStreamingPerDay: 2, // 2 * 7 = 14 GB
        hoursHdStreamingPerDay: 2, // 2 * 3 = 6 GB
        hoursVideoCallsPerDay: 4, // 4 * 1.5 = 6 GB
        gamingHoursPerDay: 2 // 0.4 GB
      });
      // Daily GB ~ 14 + 6 + 6 + 0.4 + 1 = 27.4 GB -> Monthly ~ 822 GB
      expect(net.dailyGb).toBe(27.4);
      expect(net.monthlyGb).toBe(822);
      expect(net.recommendedSpeedMbps).toBeGreaterThanOrEqual(100);
    });

    it('calculates room spatial dimensions and HVAC BTU requirements', () => {
      const dims = calculateRoomDimensions(20, 15, 9, 'feet');
      expect(dims.floorArea).toBe(300); // 20 * 15
      expect(dims.wallArea).toBe(630); // 2 * (20 + 15) * 9
      expect(dims.volume).toBe(2700); // 300 * 9
      expect(dims.coolingBtu).toBe(7500); // 300 * 25
      expect(dims.coolingTons).toBe(0.6);
    });

    it('calculates paint quantities and primer requirements correctly', () => {
      // 10 x 10 x 10 room. Perimeter 40, wall gross 400. 1 door (-21), 1 window (-15) -> net wall = 364 sq ft.
      // Ceiling 100 sq ft -> total paintable = 464 sq ft.
      // 2 coats = 928 sq ft. @ 100 sq ft/L = 9.3 Liters.
      const paint = calculatePaintCoverage(10, 10, 10, 1, 1, true, 2, 100);
      expect(paint.grossWallArea).toBe(400);
      expect(paint.netWallArea).toBe(364);
      expect(paint.ceilingArea).toBe(100);
      expect(paint.totalAreaToPaint).toBe(464);
      expect(paint.litersNeeded).toBe(9.3);
    });

    it('calculates roommate rent splits based on room area and amenities', () => {
      const rooms = [
        { id: '1', tenantName: 'Alex', roomAreaSqFt: 200, hasPrivateBathroom: true },
        { id: '2', tenantName: 'Jordan', roomAreaSqFt: 200, hasPrivateBathroom: false }
      ];
      const split = calculateRentSplit(2000, rooms, 100);
      // Amenity total: $100. Base pool: $1900. Each base: $950.
      // Alex: 950 + 100 = $1050. Jordan: $950.
      expect(split.itemized[0].totalShare).toBe(1050);
      expect(split.itemized[1].totalShare).toBe(950);
      expect(split.itemized[0].totalShare + split.itemized[1].totalShare).toBe(2000);
    });
  });

  describe('2. Construction & Renovation Mathematical Engine', () => {
    it('calculates concrete wet volume, dry expansion factor (1.54), and constituents', () => {
      // 10m x 10m x 0.1m slab = 10 m³ wet volume.
      // With 5% waste: 10.5 m³. Dry volume: 10.5 * 1.54 = 16.17 m³.
      // Mix 1:2:4 (7 parts). Cement parts = 1/7 * 16.17 = 2.31 m³.
      // Cement kg = 2.31 * 1440 = 3326.4 kg -> 3326.4 / 50 = ~66.5 bags.
      const res = calculateConcreteVolume(10, 10, 0.1, { cement: 1, sand: 2, aggregate: 4 }, 5);
      expect(res.wetVolumeCuM).toBe(10.5);
      expect(res.dryVolumeCuM).toBe(16.17);
      expect(res.cementBags50kg).toBe(66.6);
      expect(res.sandCuFt).toBeGreaterThan(160);
      expect(res.aggregateCuFt).toBeGreaterThan(320);
    });

    it('estimates brick quantities and masonry mortar requirements accurately', () => {
      // Wall 5m x 3m x 0.23m thick (9 inches) = 3.45 m³ volume. Deductions = 0.
      // Nominal brick volume (0.2m x 0.1m x 0.1m) = 0.002 m³.
      // Raw bricks: 3.45 / 0.002 = 1,725 bricks. With 7% waste = ceil(1845.75) = 1,846 bricks.
      const res = calculateBricks(5, 3, 0.23, 0, 190, 90, 90, 10, 7);
      expect(res.wallVolumeCuM).toBe(3.45);
      expect(res.bricksNeeded).toBe(1846);
      expect(res.cementBags50kg).toBeGreaterThan(0);
    });

    it('calculates tiles needed and boxes accounting for wastage', () => {
      // Room 4m x 3m = 12 m². Tile 60cm x 60cm (0.6x0.6m) = 0.36 m².
      // Raw tiles = 12 / 0.36 = 33.33 tiles. With 10% waste = ceil(36.67) = 37 tiles.
      // 4 tiles/box = ceil(37 / 4) = 10 boxes.
      const res = calculateTiles(4, 3, 60, 60, 0, 4, 30, 10, 'meters');
      expect(res.roomAreaSqM).toBe(12);
      expect(res.tilesNeeded).toBe(37);
      expect(res.boxesNeeded).toBe(10);
      expect(res.totalCost).toBe(300);
    });

    it('calculates wall plastering requirements with 1.33 dry factor', () => {
      const res = calculatePlaster(100, 12, { cement: 1, sand: 4 }, 10);
      expect(res.areaSqM).toBe(100);
      expect(res.cementBags50kg).toBeGreaterThan(0);
      expect(res.sandCuFt).toBeGreaterThan(0);
    });

    it('calculates pitched roof area and shingle squares correctly', () => {
      // 40ft x 30ft building, 12" overhang -> 42ft x 32ft = 1,344 sq ft flat.
      // Pitch 4/12 multiplier: sqrt(1 + (4/12)^2) = sqrt(1 + 0.1111) = 1.054.
      // Pitched area = 1344 * 1.054 = 1,417 sq ft.
      const res = calculateRoofing(40, 30, 4, 12, 10);
      expect(res.flatAreaSqFt).toBe(1344);
      expect(res.pitchedAreaSqFt).toBe(1417);
      expect(res.roofingSquares).toBeGreaterThan(15);
      expect(res.shingleBundles).toBeGreaterThan(45);
    });

    it('calculates staircase geometry, stringer length, and Blondel comfort score', () => {
      // Total rise 108 inches (9ft). Target riser 7.25".
      // Steps = round(108 / 7.25) = round(14.89) = 15 risers.
      // Actual riser = 108 / 15 = 7.20 inches. Treads = 14. Run = 14 * 11" = 154 inches (12.8 ft).
      // Blondel score: 2 * 7.2 + 11 = 25.4 (Comfortable!).
      const res = calculateStaircaseGeometry(108, 7.25, 11.0);
      expect(res.stepsCount).toBe(15);
      expect(res.actualRiserInches).toBe(7.2);
      expect(res.numberOfTreads).toBe(14);
      expect(res.totalRunInches).toBe(154);
      expect(res.blondelScore).toBe(25.4);
      expect(res.isComfortable).toBe(true);
    });

    it('estimates residential construction cost and percentage breakdowns', () => {
      const res = estimateConstructionCost(2000, 'standard', 200);
      expect(res.totalEstimatedCost).toBe(400000);
      expect(res.breakdown.structureAndGrey).toBe(180000); // 45%
      expect(res.breakdown.finishingAndFlooring).toBe(60000); // 15%
      expect(res.breakdown.contingencyReserve).toBe(24000); // 6%
    });
  });

  describe('3. Property & Rental Mathematics Engine', () => {
    it('converts property area across Modern LDA (225 sq ft) and Cadastral standards', () => {
      // 10 Marlas under Modern LDA standard (225 sq ft/Marla) = 2,250 sq ft = 250 sq yards = 0.5 Kanals
      const lda = convertPropertyArea(10, 'marlas', 'lda_modern');
      expect(lda.sqFeet).toBe(2250);
      expect(lda.sqYards).toBe(250);
      expect(lda.kanals).toBe(0.5);

      // 10 Marlas under Traditional Revenue standard (272.25 sq ft/Marla) = 2,722.5 sq ft
      const rev = convertPropertyArea(10, 'marlas', 'traditional_revenue');
      expect(rev.sqFeet).toBe(2722.5);
      expect(rev.kanals).toBe(0.5);
    });

    it('calculates property price with location premiums and development fees', () => {
      const res = calculatePropertyPrice({
        area: 10,
        ratePerUnit: 100000, // Base: $1,000,000
        cornerPlotPremiumPercent: 10, // +$100,000
        parkFacingPremiumPercent: 5, // +$50,000
        developmentCharges: 50000 // +$50,000
      });
      expect(res.basePrice).toBe(1000000);
      expect(res.cornerFee).toBe(100000);
      expect(res.parkFee).toBe(50000);
      expect(res.grandTotal).toBe(1200000);
    });

    it('calculates property registration and stamp duty expenses', () => {
      const res = calculateRegistrationExpenses(500000, 3, 1, 1, 0.5, 1000);
      // Stamp: $15,000, Reg: $5,000, Transfer: $5,000, Mutation: $2,500, Legal: $1,000. Total = $28,500.
      expect(res.stampDuty).toBe(15000);
      expect(res.registrationFee).toBe(5000);
      expect(res.transferTax).toBe(5000);
      expect(res.mutationTax).toBe(2500);
      expect(res.totalExpenses).toBe(28500);
      expect(res.effectiveExpensePercent).toBe(5.7);
    });

    it('calculates gross and net rental yields accurately', () => {
      // Price: $300,000, Rent: $2,000/mo ($24,000/yr). Vacancy: 5% ($1,200).
      // Effective Gross: $22,800. Expenses: $3,600. Net: $19,200.
      // Gross Yield: 24,000 / 300,000 = 8.0%. Net Yield: 19,200 / 300,000 = 6.4%.
      const res = calculateRentalYield(300000, 2000, 1600, 1000, 500, 500, 5);
      expect(res.grossAnnualRent).toBe(24000);
      expect(res.vacancyLoss).toBe(1200);
      expect(res.effectiveGrossRent).toBe(22800);
      expect(res.totalAnnualExpenses).toBe(3600);
      expect(res.netAnnualIncome).toBe(19200);
      expect(res.grossYieldPercent).toBe(8);
      expect(res.netYieldPercent).toBe(6.4);
    });

    it('calculates monthly mortgage PITI payments accurately', () => {
      // Home: $400,000, Down: $80,000 (20%), Loan: $320,000. Rate: 6% for 30 yrs.
      // Monthly P&I is approx $1,918.56. Property tax 1.2%: $400/mo. Insurance: $100/mo. Total PITI: ~$2,418.56.
      const res = calculateMortgagePiti(400000, 80000, 6.0, 30, 1.2, 1200, 0);
      expect(res.loanPrincipal).toBe(320000);
      expect(res.downPaymentPercent).toBe(20);
      expect(res.monthlyPrincipalAndInterest).toBeCloseTo(1918.56, 1);
      expect(res.monthlyPropertyTax).toBe(400);
      expect(res.monthlyInsurance).toBe(100);
      expect(res.totalMonthlyPiti).toBeCloseTo(2418.56, 1);
    });

    it('evaluates home loan affordability based on 28/36 DTI rules', () => {
      // Gross Income: $10,000/mo. Front-end 28%: $2,800. Back-end 36%: $3,600 - $600 debt = $3,000.
      // Binding limit is $2,800/mo.
      const res = calculateLoanAffordability(10000, 600, 50000, 6.5, 30, 28, 36);
      expect(res.frontEndLimit).toBe(2800);
      expect(res.backEndLimit).toBe(3000);
      expect(res.maxMonthlyPaymentAllowed).toBe(2800);
      expect(res.maxAffordableHomePrice).toBeGreaterThan(400000);
    });

    it('evaluates property investment metrics (Cap Rate, Cash-on-Cash Return)', () => {
      // Price: $300,000, 20% down ($60k) + 3% closing ($9k) = $69,000 initial cash.
      // Rent: $2,500/mo ($30,000/yr). Operating expenses: $600/mo ($7,200/yr).
      // NOI = 30,000 - 7,200 = $22,800. Cap Rate = 22,800 / 300,000 = 7.6%.
      // Mortgage debt: $15,000/yr -> Cash flow = $7,800.
      // Cash on Cash Return = 7,800 / 69,000 = 11.3%.
      const res = calculatePropertyInvestment(300000, 20, 3, 2500, 600, 15000);
      expect(res.totalInitialCashInvested).toBe(69000);
      expect(res.netOperatingIncome).toBe(22800);
      expect(res.capRatePercent).toBe(7.6);
      expect(res.annualCashFlow).toBe(7800);
      expect(res.cashOnCashReturnPercent).toBe(11.3);
    });

    it('compares Rent vs Buy over multiple years and generates a recommendation', () => {
      const res = calculateRentVsBuy(1800, 350000, 70000, 6.5, 10);
      expect(res.yearsCompared).toBe(10);
      expect(res.yearlyComparison.length).toBe(10);
      expect(res.recommendation).toBeDefined();
    });
  });

  describe('4. IndexedDB householdDB Operations', () => {
    it('supports saving, querying, and deleting chores in householdDB', async () => {
      const chore = {
        id: 'test_chore_1',
        title: 'Deep clean oven',
        room: 'Kitchen',
        frequency: 'monthly' as const,
        isCompleted: false,
        createdAt: new Date().toISOString()
      };

      await householdDB.saveChore(chore);
      const all = await householdDB.getChores();
      expect(all.some(c => c.id === 'test_chore_1')).toBe(true);

      await householdDB.toggleChoreCompletion('test_chore_1');
      const toggled = await householdDB.getChores();
      expect(toggled.find(c => c.id === 'test_chore_1')?.isCompleted).toBe(true);

      await householdDB.deleteChore('test_chore_1');
      const afterDel = await householdDB.getChores();
      expect(afterDel.some(c => c.id === 'test_chore_1')).toBe(false);
    });

    it('supports saving, querying, and deleting inventory items', async () => {
      const item = {
        id: 'test_inv_1',
        name: 'Organic Honey',
        category: 'pantry' as const,
        quantity: 2,
        unit: 'jars',
        updatedAt: new Date().toISOString()
      };

      await householdDB.saveInventoryItem(item);
      const pantry = await householdDB.getInventoryByCategory('pantry');
      expect(pantry.some(i => i.id === 'test_inv_1')).toBe(true);

      await householdDB.deleteInventoryItem('test_inv_1');
      const afterDel = await householdDB.getInventoryByCategory('pantry');
      expect(afterDel.some(i => i.id === 'test_inv_1')).toBe(false);
    });

    it('exports all household stores and restores accurately', async () => {
      const chore = {
        id: 'export_chore_1',
        title: 'Water plants',
        room: 'Balcony',
        frequency: 'daily' as const,
        isCompleted: false,
        createdAt: new Date().toISOString()
      };
      await householdDB.saveChore(chore);

      const exported = await householdDB.exportAll();
      expect(exported.chores.some(c => c.id === 'export_chore_1')).toBe(true);

      await householdDB.restoreAll(exported, 'merge');
      const stats = await householdDB.getStats();
      expect(stats.total).toBeGreaterThan(0);
    });
  });

  describe('5. React UI Components Rendering', () => {
    it('renders HomeElectricityBillEstimator with calculation inputs', () => {
      render(<HomeElectricityBillEstimator />);
      expect(screen.getByText(/Tiered Slab Electricity Tariff Estimator/i)).toBeInTheDocument();
      expect(screen.getByText(/Estimated Total Bill/i)).toBeInTheDocument();
    });

    it('renders ConcreteCalculator with mix grade selector', () => {
      render(<ConcreteCalculator />);
      expect(screen.getByText(/M15 \(1:2:4\) - Standard Slab/i)).toBeInTheDocument();
      expect(screen.getByText(/Wet Volume/i)).toBeInTheDocument();
    });

    it('renders HouseholdChorePlanner with task list', async () => {
      render(<HouseholdChorePlanner />);
      expect(screen.getByText(/Household Chore Planner/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/New chore title/i)).toBeInTheDocument();
    });

    it('renders PropertyAreaConverter with regional standards selector', () => {
      render(<PropertyAreaConverter />);
      expect(screen.getByText(/Modern \/ LDA \(225 sq ft \/ Marla\)/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Square Feet/i).length).toBeGreaterThan(0);
    });
  });
});
