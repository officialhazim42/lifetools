/**
 * LifeTools — Property & Rental Utilities Mathematical Engine
 * Rigorous real estate calculations for land area conversions,
 * regional standards (Kanal/Marla variations), property valuation,
 * mortgage PITI, rental yields, investment metrics, and Rent vs Buy models.
 */

export type MarlaStandard = 'lda_modern' | 'traditional_revenue' | 'commercial' | 'custom';

export const MARLA_STANDARDS: Record<
  MarlaStandard,
  { name: string; sqFtPerMarla: number; description: string }
> = {
  lda_modern: {
    name: 'Modern / LDA Standard (225 sq ft)',
    sqFtPerMarla: 225,
    description: 'Widely used in Lahore Development Authority (LDA), DHA, and modern planned housing societies across Pakistan.'
  },
  traditional_revenue: {
    name: 'Traditional / Revenue Cadastral (272.25 sq ft)',
    sqFtPerMarla: 272.25,
    description: 'Historical British colonial standard used by the Land Revenue Department (1 Acre = 8 Kanals = 160 Marlas).'
  },
  commercial: {
    name: 'Commercial Society Standard (200 sq ft)',
    sqFtPerMarla: 200,
    description: 'Utilized in specific urban commercial zones and dense metropolitan subdivisions.'
  },
  custom: {
    name: 'Custom User Standard',
    sqFtPerMarla: 225,
    description: 'User-defined square feet per Marla configuration.'
  }
};

export interface PropertyAreaUnits {
  sqFeet: number;
  sqMeters: number;
  sqYards: number;
  acres: number;
  hectares: number;
  kanals: number;
  marlas: number;
  bighas: number;
  gunthas: number;
  cents: number;
  grounds: number;
}

export function convertPropertyArea(
  value: number,
  fromUnit: keyof PropertyAreaUnits,
  marlaStd: MarlaStandard = 'lda_modern',
  customMarlaSqFt: number = 225
): PropertyAreaUnits {
  const sqFtPerMarla =
    marlaStd === 'custom' && customMarlaSqFt > 0
      ? customMarlaSqFt
      : MARLA_STANDARDS[marlaStd].sqFtPerMarla;

  const sqFtPerKanal = sqFtPerMarla * 20;

  // Conversion factors to Base: Square Feet
  const toSqFtFactors: Record<keyof PropertyAreaUnits, number> = {
    sqFeet: 1,
    sqMeters: 10.7639104,
    sqYards: 9,
    acres: 43560,
    hectares: 107639.104,
    kanals: sqFtPerKanal,
    marlas: sqFtPerMarla,
    bighas: 27225, // 1 Pucca Bigha ~ 27,225 sq ft
    gunthas: 1089, // 1 Guntha = 1,089 sq ft (40 gunthas = 1 acre)
    cents: 435.6, // 1 Cent = 435.6 sq ft (100 cents = 1 acre)
    grounds: 2400 // 1 Ground = 2,400 sq ft (Tamil Nadu)
  };

  const sqFt = value * toSqFtFactors[fromUnit];

  return {
    sqFeet: Math.round(sqFt * 100) / 100,
    sqMeters: Math.round((sqFt / 10.7639104) * 100) / 100,
    sqYards: Math.round((sqFt / 9) * 100) / 100,
    acres: Math.round((sqFt / 43560) * 10000) / 10000,
    hectares: Math.round((sqFt / 107639.104) * 10000) / 10000,
    kanals: Math.round((sqFt / sqFtPerKanal) * 1000) / 1000,
    marlas: Math.round((sqFt / sqFtPerMarla) * 100) / 100,
    bighas: Math.round((sqFt / 27225) * 1000) / 1000,
    gunthas: Math.round((sqFt / 1089) * 100) / 100,
    cents: Math.round((sqFt / 435.6) * 100) / 100,
    grounds: Math.round((sqFt / 2400) * 1000) / 1000
  };
}

export function calculatePropertyPrice(params: {
  area: number;
  ratePerUnit: number;
  cornerPlotPremiumPercent?: number;
  parkFacingPremiumPercent?: number;
  mainBoulevardPremiumPercent?: number;
  developmentCharges?: number;
  utilityConnectionFees?: number;
}) {
  const basePrice = params.area * params.ratePerUnit;
  const cornerFee = (basePrice * (params.cornerPlotPremiumPercent || 0)) / 100;
  const parkFee = (basePrice * (params.parkFacingPremiumPercent || 0)) / 100;
  const roadFee = (basePrice * (params.mainBoulevardPremiumPercent || 0)) / 100;
  const totalPremiums = cornerFee + parkFee + roadFee;

  const totalBeforeFees = basePrice + totalPremiums;
  const additionalFees = (params.developmentCharges || 0) + (params.utilityConnectionFees || 0);
  const grandTotal = totalBeforeFees + additionalFees;

  return {
    basePrice: Math.round(basePrice),
    totalPremiums: Math.round(totalPremiums),
    cornerFee: Math.round(cornerFee),
    parkFee: Math.round(parkFee),
    roadFee: Math.round(roadFee),
    additionalFees: Math.round(additionalFees),
    grandTotal: Math.round(grandTotal),
    effectiveRatePerUnit: Math.round((grandTotal / Math.max(0.1, params.area)) * 100) / 100
  };
}

export function calculateRegistrationExpenses(
  propertyValue: number,
  stampDutyPercent: number = 3.0,
  registrationFeePercent: number = 1.0,
  transferTaxPercent: number = 1.0,
  mutationAndLocalTaxesPercent: number = 0.5,
  legalAndDocumentationFee: number = 500
) {
  const stampDuty = (propertyValue * stampDutyPercent) / 100;
  const registrationFee = (propertyValue * registrationFeePercent) / 100;
  const transferTax = (propertyValue * transferTaxPercent) / 100;
  const mutationTax = (propertyValue * mutationAndLocalTaxesPercent) / 100;

  const totalGovernmentDues = stampDuty + registrationFee + transferTax + mutationTax;
  const grandTotal = totalGovernmentDues + legalAndDocumentationFee;
  const effectiveExpensePercent = propertyValue > 0 ? (grandTotal / propertyValue) * 100 : 0;

  return {
    propertyValue,
    stampDuty: Math.round(stampDuty),
    registrationFee: Math.round(registrationFee),
    transferTax: Math.round(transferTax),
    mutationTax: Math.round(mutationTax),
    legalFee: Math.round(legalAndDocumentationFee),
    totalExpenses: Math.round(grandTotal),
    effectiveExpensePercent: Math.round(effectiveExpensePercent * 100) / 100
  };
}

export function calculateRentalYield(
  propertyPurchasePrice: number,
  monthlyRent: number,
  annualMaintenanceCost: number = 0,
  annualPropertyTax: number = 0,
  annualInsurance: number = 0,
  annualHoaDues: number = 0,
  vacancyRatePercent: number = 5
) {
  const grossAnnualRent = monthlyRent * 12;
  const vacancyLoss = (grossAnnualRent * vacancyRatePercent) / 100;
  const effectiveGrossRent = grossAnnualRent - vacancyLoss;

  const totalAnnualOperatingExpenses =
    annualMaintenanceCost + annualPropertyTax + annualInsurance + annualHoaDues;

  const netAnnualIncome = effectiveGrossRent - totalAnnualOperatingExpenses;

  const grossYield = propertyPurchasePrice > 0 ? (grossAnnualRent / propertyPurchasePrice) * 100 : 0;
  const netYield = propertyPurchasePrice > 0 ? (netAnnualIncome / propertyPurchasePrice) * 100 : 0;

  return {
    grossAnnualRent: Math.round(grossAnnualRent),
    vacancyLoss: Math.round(vacancyLoss),
    effectiveGrossRent: Math.round(effectiveGrossRent),
    totalAnnualExpenses: Math.round(totalAnnualOperatingExpenses),
    netAnnualIncome: Math.round(netAnnualIncome),
    grossYieldPercent: Math.round(grossYield * 100) / 100,
    netYieldPercent: Math.round(netYield * 100) / 100
  };
}

export function calculateMortgagePiti(
  homePrice: number,
  downPayment: number,
  annualInterestRatePercent: number,
  loanTermYears: number = 30,
  annualPropertyTaxPercent: number = 1.2,
  annualHomeownersInsurance: number = 1200,
  annualPmiPercent: number = 0.5 // If down payment < 20%
) {
  const loanPrincipal = Math.max(0, homePrice - downPayment);
  const monthlyInterestRate = annualInterestRatePercent / 100 / 12;
  const totalMonths = loanTermYears * 12;

  let monthlyPrincipalAndInterest = 0;
  if (monthlyInterestRate > 0 && totalMonths > 0) {
    monthlyPrincipalAndInterest =
      (loanPrincipal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths))) /
      (Math.pow(1 + monthlyInterestRate, totalMonths) - 1);
  } else if (totalMonths > 0) {
    monthlyPrincipalAndInterest = loanPrincipal / totalMonths;
  }

  const monthlyPropertyTax = (homePrice * (annualPropertyTaxPercent / 100)) / 12;
  const monthlyInsurance = annualHomeownersInsurance / 12;

  const downPaymentPercent = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
  const requiresPmi = downPaymentPercent < 20 && loanPrincipal > 0;
  const monthlyPmi = requiresPmi ? (loanPrincipal * (annualPmiPercent / 100)) / 12 : 0;

  const totalMonthlyPiti =
    monthlyPrincipalAndInterest + monthlyPropertyTax + monthlyInsurance + monthlyPmi;

  const totalLoanRepayment = monthlyPrincipalAndInterest * totalMonths;
  const totalInterestPaid = Math.max(0, totalLoanRepayment - loanPrincipal);

  return {
    loanPrincipal: Math.round(loanPrincipal),
    downPaymentPercent: Math.round(downPaymentPercent * 10) / 10,
    monthlyPrincipalAndInterest: Math.round(monthlyPrincipalAndInterest * 100) / 100,
    monthlyPropertyTax: Math.round(monthlyPropertyTax * 100) / 100,
    monthlyInsurance: Math.round(monthlyInsurance * 100) / 100,
    monthlyPmi: Math.round(monthlyPmi * 100) / 100,
    totalMonthlyPiti: Math.round(totalMonthlyPiti * 100) / 100,
    totalInterestPaid: Math.round(totalInterestPaid),
    totalCostOfLoan: Math.round(totalLoanRepayment)
  };
}

export function calculateLoanAffordability(
  grossMonthlyIncome: number,
  monthlyDebtPayments: number = 0,
  downPaymentSaved: number = 50000,
  annualInterestRatePercent: number = 6.5,
  loanTermYears: number = 30,
  frontEndDtiPercent: number = 28, // Max % of income for housing
  backEndDtiPercent: number = 36 // Max % of income for total debt + housing
) {
  // Max allowable housing payment under Front-End rule
  const maxHousingFrontEnd = (grossMonthlyIncome * frontEndDtiPercent) / 100;

  // Max allowable housing payment under Back-End rule
  const maxTotalDebt = (grossMonthlyIncome * backEndDtiPercent) / 100;
  const maxHousingBackEnd = Math.max(0, maxTotalDebt - monthlyDebtPayments);

  // The binding constraint is the lower of the two
  const maxMonthlyPaymentAllowed = Math.min(maxHousingFrontEnd, maxHousingBackEnd);

  // Assuming ~15% of payment goes to tax & insurance, ~85% to P&I
  const maxPrincipalAndInterest = maxMonthlyPaymentAllowed * 0.85;

  const monthlyRate = annualInterestRatePercent / 100 / 12;
  const totalMonths = loanTermYears * 12;

  let maxBorrowingCapacity = 0;
  if (monthlyRate > 0) {
    maxBorrowingCapacity =
      (maxPrincipalAndInterest * (Math.pow(1 + monthlyRate, totalMonths) - 1)) /
      (monthlyRate * Math.pow(1 + monthlyRate, totalMonths));
  }

  const maxAffordableHomePrice = maxBorrowingCapacity + downPaymentSaved;

  return {
    grossMonthlyIncome,
    maxMonthlyPaymentAllowed: Math.round(maxMonthlyPaymentAllowed),
    maxPrincipalAndInterest: Math.round(maxPrincipalAndInterest),
    maxBorrowingCapacity: Math.round(maxBorrowingCapacity),
    downPaymentSaved,
    maxAffordableHomePrice: Math.round(maxAffordableHomePrice),
    frontEndLimit: Math.round(maxHousingFrontEnd),
    backEndLimit: Math.round(maxHousingBackEnd)
  };
}

export function calculatePropertyInvestment(
  purchasePrice: number,
  downPaymentPercent: number = 20,
  closingCostsPercent: number = 3,
  grossMonthlyRentalIncome: number = 2500,
  operatingExpensesMonthly: number = 600,
  annualMortgagePayment: number = 14000
) {
  const downPayment = (purchasePrice * downPaymentPercent) / 100;
  const closingCosts = (purchasePrice * closingCostsPercent) / 100;
  const totalInitialCashInvested = downPayment + closingCosts;

  const grossAnnualIncome = grossMonthlyRentalIncome * 12;
  const annualOperatingExpenses = operatingExpensesMonthly * 12;

  const netOperatingIncome = grossAnnualIncome - annualOperatingExpenses;
  const annualCashFlow = netOperatingIncome - annualMortgagePayment;

  const capRate = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0;
  const cashOnCashReturn =
    totalInitialCashInvested > 0 ? (annualCashFlow / totalInitialCashInvested) * 100 : 0;

  return {
    totalInitialCashInvested: Math.round(totalInitialCashInvested),
    grossAnnualIncome: Math.round(grossAnnualIncome),
    annualOperatingExpenses: Math.round(annualOperatingExpenses),
    netOperatingIncome: Math.round(netOperatingIncome),
    annualCashFlow: Math.round(annualCashFlow),
    monthlyCashFlow: Math.round(annualCashFlow / 12),
    capRatePercent: Math.round(capRate * 100) / 100,
    cashOnCashReturnPercent: Math.round(cashOnCashReturn * 100) / 100
  };
}

export function calculateRentVsBuy(
  monthlyRent: number,
  homePrice: number,
  downPayment: number,
  mortgageRatePercent: number = 6.5,
  yearsToCompare: number = 10,
  homeAppreciationAnnualPercent: number = 3.5,
  rentInflationAnnualPercent: number = 3.5,
  investmentReturnAnnualPercent: number = 7.0
) {
  let cumulativeRentCost = 0;
  let currentRent = monthlyRent;
  let investmentPortfolio = downPayment; // Opportunity cost: investing down payment in index fund

  // Mortgage details
  const loanPrincipal = Math.max(0, homePrice - downPayment);
  const monthlyRate = mortgageRatePercent / 100 / 12;
  const totalMonths = 30 * 12;
  const monthlyMortgage =
    monthlyRate > 0
      ? (loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanPrincipal / totalMonths;

  let homeValue = homePrice;
  let remainingPrincipal = loanPrincipal;
  let cumulativeBuyCost = downPayment;

  const yearlyComparison: Array<{
    year: number;
    cumulativeRentSpent: number;
    renterNetWorth: number;
    cumulativeBuySpent: number;
    homeEquity: number;
    homeValue: number;
  }> = [];

  for (let y = 1; y <= yearsToCompare; y++) {
    // Renter side
    const annualRent = currentRent * 12;
    cumulativeRentCost += annualRent;
    currentRent *= 1 + rentInflationAnnualPercent / 100;
    investmentPortfolio *= 1 + investmentReturnAnnualPercent / 100;

    // Buyer side: mortgage + 1% maintenance + 1.2% taxes
    const annualMortgage = monthlyMortgage * 12;
    const annualMaintenance = homeValue * 0.01;
    const annualPropertyTax = homeValue * 0.012;
    const annualBuyerExpense = annualMortgage + annualMaintenance + annualPropertyTax;
    cumulativeBuyCost += annualBuyerExpense;

    // Appreciation
    homeValue *= 1 + homeAppreciationAnnualPercent / 100;

    // Principal paydown approximation
    remainingPrincipal = Math.max(0, remainingPrincipal - (annualMortgage * 0.35 + y * 200));
    const homeEquity = Math.max(0, homeValue - remainingPrincipal);

    yearlyComparison.push({
      year: y,
      cumulativeRentSpent: Math.round(cumulativeRentCost),
      renterNetWorth: Math.round(investmentPortfolio),
      cumulativeBuySpent: Math.round(cumulativeBuyCost),
      homeEquity: Math.round(homeEquity),
      homeValue: Math.round(homeValue)
    });
  }

  const finalYear = yearlyComparison[yearlyComparison.length - 1];
  const buyerAdvantage = finalYear.homeEquity - finalYear.renterNetWorth;

  return {
    yearsCompared: yearsToCompare,
    monthlyRent,
    homePrice,
    downPayment,
    monthlyMortgagePitiEst: Math.round(monthlyMortgage + (homePrice * 0.022) / 12),
    yearlyComparison,
    recommendation:
      buyerAdvantage > 0
        ? `Buying is estimated to be more financially advantageous by ~${Math.round(buyerAdvantage).toLocaleString()} after ${yearsToCompare} years.`
        : `Renting and investing the down payment difference is estimated to be more advantageous by ~${Math.round(Math.abs(buyerAdvantage)).toLocaleString()} after ${yearsToCompare} years.`
  };
}
