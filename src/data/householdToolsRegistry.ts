import { lazy } from 'react';
import { ToolItem } from '../types';

// Lazy load Home Calculator Tools (15 tools)
const HomeElectricityBillEstimator = lazy(() =>
  import('../components/tools/household/HomeCalculatorTools').then((m) => ({ default: m.HomeElectricityBillEstimator }))
);
const ElectricityConsumptionCalculator = lazy(() =>
  import('../components/tools/household/HomeCalculatorTools').then((m) => ({ default: m.ElectricityConsumptionCalculator }))
);
const ApplianceElectricityCostCalculator = lazy(() =>
  import('../components/tools/household/HomeCalculatorTools').then((m) => ({ default: m.ApplianceElectricityCostCalculator }))
);
const MonthlyWaterBillEstimator = lazy(() =>
  import('../components/tools/household/HomeCalculatorTools').then((m) => ({ default: m.MonthlyWaterBillEstimator }))
);
const HouseholdWaterConsumptionCalculator = lazy(() =>
  import('../components/tools/household/HomeCalculatorTools').then((m) => ({ default: m.HouseholdWaterConsumptionCalculator }))
);
const LpgGasConsumptionCalculator = lazy(() =>
  import('../components/tools/household/HomeCalculatorTools').then((m) => ({ default: m.LpgGasConsumptionCalculator }))
);
const SolarPanelRequirementCalculator = lazy(() =>
  import('../components/tools/household/HomeCalculatorTools').then((m) => ({ default: m.SolarPanelRequirementCalculator }))
);
const SolarEnergySavingsCalculator = lazy(() =>
  import('../components/tools/household/HomeCalculatorTools').then((m) => ({ default: m.SolarEnergySavingsCalculator }))
);
const HomeInternetUsageCalculator = lazy(() =>
  import('../components/tools/household/HomeCalculatorTools').then((m) => ({ default: m.HomeInternetUsageCalculator }))
);
const HouseholdMonthlyBudgetCalculator = lazy(() =>
  import('../components/tools/household/HomeCalculatorTools').then((m) => ({ default: m.HouseholdMonthlyBudgetCalculator }))
);
const HouseholdRentSplitCalculator = lazy(() =>
  import('../components/tools/household/HomeCalculatorTools').then((m) => ({ default: m.HouseholdRentSplitCalculator }))
);
const RoomAreaCalculator = lazy(() =>
  import('../components/tools/household/HomeCalculatorTools').then((m) => ({ default: m.RoomAreaCalculator }))
);
const RoomVolumeCalculator = lazy(() =>
  import('../components/tools/household/HomeCalculatorTools').then((m) => ({ default: m.RoomVolumeCalculator }))
);
const PaintQuantityCalculator = lazy(() =>
  import('../components/tools/household/HomeCalculatorTools').then((m) => ({ default: m.PaintQuantityCalculator }))
);
const WallpaperCalculator = lazy(() =>
  import('../components/tools/household/HomeCalculatorTools').then((m) => ({ default: m.WallpaperCalculator }))
);

// Lazy load Construction & Renovation Tools (15 tools)
const CementCalculator = lazy(() =>
  import('../components/tools/household/ConstructionCalculatorTools').then((m) => ({ default: m.CementCalculator }))
);
const ConcreteCalculator = lazy(() =>
  import('../components/tools/household/ConstructionCalculatorTools').then((m) => ({ default: m.ConcreteCalculator }))
);
const BrickCalculator = lazy(() =>
  import('../components/tools/household/ConstructionCalculatorTools').then((m) => ({ default: m.BrickCalculator }))
);
const SandQuantityCalculator = lazy(() =>
  import('../components/tools/household/ConstructionCalculatorTools').then((m) => ({ default: m.SandQuantityCalculator }))
);
const AggregateCalculator = lazy(() =>
  import('../components/tools/household/ConstructionCalculatorTools').then((m) => ({ default: m.AggregateCalculator }))
);
const TileCalculator = lazy(() =>
  import('../components/tools/household/ConstructionCalculatorTools').then((m) => ({ default: m.TileCalculator }))
);
const FlooringCostCalculator = lazy(() =>
  import('../components/tools/household/ConstructionCalculatorTools').then((m) => ({ default: m.FlooringCostCalculator }))
);
const WallAreaCalculator = lazy(() =>
  import('../components/tools/household/ConstructionCalculatorTools').then((m) => ({ default: m.WallAreaCalculator }))
);
const PlasterCalculator = lazy(() =>
  import('../components/tools/household/ConstructionCalculatorTools').then((m) => ({ default: m.PlasterCalculator }))
);
const RoofingMaterialCalculator = lazy(() =>
  import('../components/tools/household/ConstructionCalculatorTools').then((m) => ({ default: m.RoofingMaterialCalculator }))
);
const StaircaseCalculator = lazy(() =>
  import('../components/tools/household/ConstructionCalculatorTools').then((m) => ({ default: m.StaircaseCalculator }))
);
const DoorWindowAreaCalculator = lazy(() =>
  import('../components/tools/household/ConstructionCalculatorTools').then((m) => ({ default: m.DoorWindowAreaCalculator }))
);
const ConstructionCostEstimator = lazy(() =>
  import('../components/tools/household/ConstructionCalculatorTools').then((m) => ({ default: m.ConstructionCostEstimator }))
);
const ConstructionMaterialCostCalculator = lazy(() =>
  import('../components/tools/household/ConstructionCalculatorTools').then((m) => ({ default: m.ConstructionMaterialCostCalculator }))
);
const RenovationBudgetPlanner = lazy(() =>
  import('../components/tools/household/ConstructionCalculatorTools').then((m) => ({ default: m.RenovationBudgetPlanner }))
);

// Lazy load Home Organization Tools (15 tools)
const HouseholdChorePlanner = lazy(() =>
  import('../components/tools/household/HomeOrganizationTools').then((m) => ({ default: m.HouseholdChorePlanner }))
);
const CleaningScheduleGenerator = lazy(() =>
  import('../components/tools/household/HomeOrganizationTools').then((m) => ({ default: m.CleaningScheduleGenerator }))
);
const DailyCleaningChecklist = lazy(() =>
  import('../components/tools/household/HomeOrganizationTools').then((m) => ({ default: m.DailyCleaningChecklist }))
);
const WeeklyCleaningPlanner = lazy(() =>
  import('../components/tools/household/HomeOrganizationTools').then((m) => ({ default: m.WeeklyCleaningPlanner }))
);
const MonthlyCleaningPlanner = lazy(() =>
  import('../components/tools/household/HomeOrganizationTools').then((m) => ({ default: m.MonthlyCleaningPlanner }))
);
const LaundrySchedulePlanner = lazy(() =>
  import('../components/tools/household/HomeOrganizationTools').then((m) => ({ default: m.LaundrySchedulePlanner }))
);
const GroceryInventoryManager = lazy(() =>
  import('../components/tools/household/HomeOrganizationTools').then((m) => ({ default: m.GroceryInventoryManager }))
);
const PantryInventoryTracker = lazy(() =>
  import('../components/tools/household/HomeOrganizationTools').then((m) => ({ default: m.PantryInventoryTracker }))
);
const RefrigeratorInventoryTracker = lazy(() =>
  import('../components/tools/household/HomeOrganizationTools').then((m) => ({ default: m.RefrigeratorInventoryTracker }))
);
const HouseholdShoppingList = lazy(() =>
  import('../components/tools/household/HomeOrganizationTools').then((m) => ({ default: m.HouseholdShoppingList }))
);
const HomeInventoryManager = lazy(() =>
  import('../components/tools/household/HomeOrganizationTools').then((m) => ({ default: m.HomeInventoryManager }))
);
const FurnitureMeasurementPlanner = lazy(() =>
  import('../components/tools/household/HomeOrganizationTools').then((m) => ({ default: m.FurnitureMeasurementPlanner }))
);
const RoomLayoutPlanner = lazy(() =>
  import('../components/tools/household/HomeOrganizationTools').then((m) => ({ default: m.RoomLayoutPlanner }))
);
const StorageSpaceCalculator = lazy(() =>
  import('../components/tools/household/HomeOrganizationTools').then((m) => ({ default: m.StorageSpaceCalculator }))
);
const MovingHouseChecklist = lazy(() =>
  import('../components/tools/household/HomeOrganizationTools').then((m) => ({ default: m.MovingHouseChecklist }))
);

// Lazy load Home Maintenance Tools (10 tools)
const HomeMaintenanceTracker = lazy(() =>
  import('../components/tools/household/HomeMaintenanceTools').then((m) => ({ default: m.HomeMaintenanceTracker }))
);
const ApplianceMaintenanceReminder = lazy(() =>
  import('../components/tools/household/HomeMaintenanceTools').then((m) => ({ default: m.ApplianceMaintenanceReminder }))
);
const AcServiceReminder = lazy(() =>
  import('../components/tools/household/HomeMaintenanceTools').then((m) => ({ default: m.AcServiceReminder }))
);
const HomeEquipmentMaintenanceTracker = lazy(() =>
  import('../components/tools/household/HomeMaintenanceTools').then((m) => ({ default: m.HomeEquipmentMaintenanceTracker }))
);
const PlumbingMaintenanceChecklist = lazy(() =>
  import('../components/tools/household/HomeMaintenanceTools').then((m) => ({ default: m.PlumbingMaintenanceChecklist }))
);
const ElectricalMaintenanceChecklist = lazy(() =>
  import('../components/tools/household/HomeMaintenanceTools').then((m) => ({ default: m.ElectricalMaintenanceChecklist }))
);
const WaterTankCleaningReminder = lazy(() =>
  import('../components/tools/household/HomeMaintenanceTools').then((m) => ({ default: m.WaterTankCleaningReminder }))
);
const FilterReplacementReminder = lazy(() =>
  import('../components/tools/household/HomeMaintenanceTools').then((m) => ({ default: m.FilterReplacementReminder }))
);
const HomeRepairExpenseTracker = lazy(() =>
  import('../components/tools/household/HomeMaintenanceTools').then((m) => ({ default: m.HomeRepairExpenseTracker }))
);
const WarrantyExpiryReminder = lazy(() =>
  import('../components/tools/household/HomeMaintenanceTools').then((m) => ({ default: m.WarrantyExpiryReminder }))
);

// Lazy load Property & Rental Tools (15 tools)
const PropertyAreaConverter = lazy(() =>
  import('../components/tools/household/PropertyRentalTools').then((m) => ({ default: m.PropertyAreaConverter }))
);
const SquareFeetToSquareMeterConverter = lazy(() =>
  import('../components/tools/household/PropertyRentalTools').then((m) => ({ default: m.SquareFeetToSquareMeterConverter }))
);
const AcreToKanalConverter = lazy(() =>
  import('../components/tools/household/PropertyRentalTools').then((m) => ({ default: m.AcreToKanalConverter }))
);
const KanalToMarlaConverter = lazy(() =>
  import('../components/tools/household/PropertyRentalTools').then((m) => ({ default: m.KanalToMarlaConverter }))
);
const MarlaToSquareFeetConverter = lazy(() =>
  import('../components/tools/household/PropertyRentalTools').then((m) => ({ default: m.MarlaToSquareFeetConverter }))
);
const PropertyPriceCalculator = lazy(() =>
  import('../components/tools/household/PropertyRentalTools').then((m) => ({ default: m.PropertyPriceCalculator }))
);
const PropertyRegistrationExpenseEstimator = lazy(() =>
  import('../components/tools/household/PropertyRentalTools').then((m) => ({ default: m.PropertyRegistrationExpenseEstimator }))
);
const RentalYieldCalculator = lazy(() =>
  import('../components/tools/household/PropertyRentalTools').then((m) => ({ default: m.RentalYieldCalculator }))
);
const MonthlyRentSplitter = lazy(() =>
  import('../components/tools/household/PropertyRentalTools').then((m) => ({ default: m.MonthlyRentSplitter }))
);
const SecurityDepositCalculator = lazy(() =>
  import('../components/tools/household/PropertyRentalTools').then((m) => ({ default: m.SecurityDepositCalculator }))
);
const PropertyMortgageCalculator = lazy(() =>
  import('../components/tools/household/PropertyRentalTools').then((m) => ({ default: m.PropertyMortgageCalculator }))
);
const HomeLoanAffordabilityCalculator = lazy(() =>
  import('../components/tools/household/PropertyRentalTools').then((m) => ({ default: m.HomeLoanAffordabilityCalculator }))
);
const PropertyInvestmentCalculator = lazy(() =>
  import('../components/tools/household/PropertyRentalTools').then((m) => ({ default: m.PropertyInvestmentCalculator }))
);
const RentVsBuyCalculator = lazy(() =>
  import('../components/tools/household/PropertyRentalTools').then((m) => ({ default: m.RentVsBuyCalculator }))
);
const PropertyExpenseTracker = lazy(() =>
  import('../components/tools/household/PropertyRentalTools').then((m) => ({ default: m.PropertyExpenseTracker }))
);

export const HOUSEHOLD_TOOLS_REGISTRY: ToolItem[] = [
  // 1. Home Electricity Bill Estimator
  {
    id: 'home-electricity-bill-estimator',
    name: 'Home Electricity Bill Estimator',
    shortDescription: 'Estimate residential power bills with progressive tiered tariff slabs, fixed meter charges, and fuel surcharges.',
    category: 'home',
    iconName: 'Zap',
    keywords: ['electricity bill', 'power bill', 'utility tariff', 'kwh estimator', 'energy slabs'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter total monthly electrical units (kWh).',
      'Configure tiered utility tariff slabs and rates.',
      'Adjust fixed meter fees, fuel surcharge adjustments, and taxes.'
    ],
    faqs: [
      {
        question: 'How do tiered electricity slabs work?',
        answer: 'Power utility companies charge lower unit rates for baseline consumption (e.g. first 100 kWh) and higher progressive rates as consumption increases.'
      }
    ],
    relatedTools: ['electricity-consumption-calculator', 'appliance-electricity-cost-calculator'],
    component: HomeElectricityBillEstimator
  },
  // 2. Electricity Consumption Calculator
  {
    id: 'electricity-consumption-calculator',
    name: 'Electricity Consumption Calculator',
    shortDescription: 'Audit whole-house power usage across appliances, HVAC, refrigeration, and lighting.',
    category: 'home',
    iconName: 'Zap',
    keywords: ['power consumption', 'energy auditor', 'wattage calculator', 'household kwh'],
    offlineAvailable: true,
    instructions: [
      'List household appliances with their operating wattage and daily usage hours.',
      'Review daily, monthly, and yearly kilowatt-hour footprints.',
      'Enter local electricity cost to calculate running costs.'
    ],
    faqs: [
      {
        question: 'What is 1 kWh of electricity?',
        answer: 'One kilowatt-hour (kWh) equals 1,000 Watts of electrical power consumed continuously for 1 hour.'
      }
    ],
    relatedTools: ['home-electricity-bill-estimator', 'appliance-electricity-cost-calculator'],
    component: ElectricityConsumptionCalculator
  },
  // 3. Appliance Electricity Cost Calculator
  {
    id: 'appliance-electricity-cost-calculator',
    name: 'Appliance Electricity Cost Calculator',
    shortDescription: 'Calculate the running cost of any home appliance based on wattage, hours used, and electricity rate.',
    category: 'home',
    iconName: 'Zap',
    keywords: ['appliance cost', 'ac running cost', 'heater power cost', 'wattage cost'],
    offlineAvailable: true,
    instructions: [
      'Enter appliance power rating in Watts.',
      'Set average operating hours per day.',
      'Input utility rate per kWh to see daily, monthly, and annual costs.'
    ],
    faqs: [
      {
        question: 'Where can I find appliance wattage?',
        answer: 'Check the manufacturer label on the back or bottom of the appliance (e.g. "1500W" or "120V 12.5A" = 1500W).'
      }
    ],
    relatedTools: ['home-electricity-bill-estimator', 'electricity-consumption-calculator'],
    component: ApplianceElectricityCostCalculator
  },
  // 4. Monthly Water Bill Estimator
  {
    id: 'monthly-water-bill-estimator',
    name: 'Monthly Water Bill Estimator',
    shortDescription: 'Estimate water utility bills with volumetric rates, sewage treatment surcharges, and municipal fees.',
    category: 'home',
    iconName: 'Droplets',
    keywords: ['water bill', 'water utility', 'sewage fee', 'kiloliter calculator', 'water charges'],
    offlineAvailable: true,
    instructions: [
      'Enter water consumption volume in kiloliters, cubic meters, or thousand gallons.',
      'Set unit volumetric water tariff and sewage surcharge percentage.',
      'Review complete bill breakdown.'
    ],
    faqs: [
      {
        question: 'Why is sewage charged on water bills?',
        answer: 'Most municipal utilities charge a sewage fee proportional to incoming water volume to fund wastewater treatment infrastructure.'
      }
    ],
    relatedTools: ['household-water-consumption-calculator'],
    component: MonthlyWaterBillEstimator
  },
  // 5. Water Consumption Calculator
  {
    id: 'household-water-consumption-calculator',
    name: 'Water Consumption Calculator',
    shortDescription: 'Audit indoor and outdoor household water consumption across showers, toilets, laundry, dishwashing, and gardening.',
    category: 'home',
    iconName: 'Droplets',
    keywords: ['water usage audit', 'household water', 'shower water', 'daily water consumption'],
    offlineAvailable: true,
    instructions: [
      'Enter household residents count.',
      'Input daily shower frequency and duration.',
      'Add weekly laundry, dishwasher, and garden hose irrigation usage.'
    ],
    faqs: [
      {
        question: 'What is typical household water usage per person?',
        answer: 'A typical urban resident uses between 150 and 250 liters (40 to 65 gallons) of water per day for indoor domestic needs.'
      }
    ],
    relatedTools: ['monthly-water-bill-estimator'],
    component: HouseholdWaterConsumptionCalculator
  },
  // 6. LPG Gas Consumption Calculator
  {
    id: 'lpg-gas-consumption-calculator',
    name: 'LPG Gas Consumption Calculator',
    shortDescription: 'Estimate LPG cooking gas cylinder lifespan, daily burn rate, and projected refill countdown.',
    category: 'home',
    iconName: 'Flame',
    keywords: ['lpg cylinder', 'cooking gas lifespan', 'gas cylinder refill', 'burner consumption'],
    offlineAvailable: true,
    instructions: [
      'Select LPG cylinder net weight (14.2 kg, 19 kg, or 5 kg).',
      'Input average daily cooking hours and number of active stove burners.',
      'Review estimated days and weeks until cylinder exhaustion.'
    ],
    faqs: [
      {
        question: 'How much gas does a domestic stove burner consume?',
        answer: 'A standard domestic LPG burner burns approximately 140 to 170 grams of liquefied petroleum gas per hour on medium heat.'
      }
    ],
    relatedTools: ['home-electricity-bill-estimator'],
    component: LpgGasConsumptionCalculator
  },
  // 7. Solar Panel Requirement Calculator
  {
    id: 'solar-panel-requirement-calculator',
    name: 'Solar Panel Requirement Calculator',
    shortDescription: 'Size rooftop solar PV systems based on monthly electrical usage, peak sun hours, panel wattage, and roof space.',
    category: 'home',
    iconName: 'Sun',
    keywords: ['solar sizing', 'solar panel calculator', 'rooftop solar kw', 'photovoltaic panels'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Input your average monthly power consumption (kWh).',
      'Set regional average daily peak sun hours (typically 4.5 to 5.5 hours).',
      'Select solar module rating (e.g. 400W or 540W) to see system kW capacity and required roof area.'
    ],
    faqs: [
      {
        question: 'What are Peak Sun Hours?',
        answer: 'Peak Sun Hours refer to the equivalent number of hours per day when solar irradiance averages 1,000 Watts per square meter.'
      }
    ],
    relatedTools: ['solar-energy-savings-calculator', 'home-electricity-bill-estimator'],
    component: SolarPanelRequirementCalculator
  },
  // 8. Solar Energy Savings Calculator
  {
    id: 'solar-energy-savings-calculator',
    name: 'Solar Energy Savings Calculator',
    shortDescription: 'Calculate solar system return on investment (ROI), payback period in years, and 25-year cumulative utility savings.',
    category: 'home',
    iconName: 'Sun',
    keywords: ['solar roi', 'solar payback period', 'net metering savings', 'solar financial return'],
    offlineAvailable: true,
    instructions: [
      'Enter total turnkey installation cost of the solar system.',
      'Input estimated monthly electricity bill offset.',
      'Review break-even timeline and projected lifetime financial return.'
    ],
    faqs: [
      {
        question: 'What is a typical residential solar payback period?',
        answer: 'Most grid-tied residential solar PV installations reach break-even within 4 to 8 years depending on local electricity rates.'
      }
    ],
    relatedTools: ['solar-panel-requirement-calculator'],
    component: SolarEnergySavingsCalculator
  },
  // 9. Home Internet Usage Calculator
  {
    id: 'home-internet-usage-calculator',
    name: 'Home Internet Usage Calculator',
    shortDescription: 'Estimate household broadband bandwidth needs, monthly gigabyte data usage, and recommended ISP speed tiers.',
    category: 'home',
    iconName: 'Wifi',
    keywords: ['internet bandwidth', 'data usage', 'streaming mbps', 'isp speed plan'],
    offlineAvailable: true,
    instructions: [
      'Enter family member count and connected smart devices.',
      'Input daily 4K/HD streaming hours, video meetings, and online gaming.',
      'View recommended download speed and monthly data quota.'
    ],
    faqs: [
      {
        question: 'How much data does 4K video streaming consume?',
        answer: 'Streaming in 4K Ultra HD typically consumes between 6.5 and 7.5 GB of bandwidth per hour.'
      }
    ],
    relatedTools: ['household-monthly-budget-calculator'],
    component: HomeInternetUsageCalculator
  },
  // 10. Household Monthly Budget Calculator
  {
    id: 'household-monthly-budget-calculator',
    name: 'Household Monthly Budget Calculator',
    shortDescription: 'Allocate family income across housing, utilities, groceries, transport, repairs, and savings using the 50/30/20 guideline.',
    category: 'home',
    iconName: 'Wallet',
    keywords: ['home budget', 'household expenses', 'family budget planner', '50 30 20 budget'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter monthly household net income.',
      'Input fixed housing costs, utilities, groceries, and transportation.',
      'Compare your spending balance against the recommended 50% Needs, 30% Wants, 20% Savings framework.'
    ],
    faqs: [
      {
        question: 'What is the 50/30/20 budgeting rule?',
        answer: 'A widely recognized personal finance rule allocating 50% of income to essential needs, 30% to discretionary wants, and 20% to savings or debt paydown.'
      }
    ],
    relatedTools: ['household-rent-split-calculator'],
    component: HouseholdMonthlyBudgetCalculator
  },
  // 11. Rent Split Calculator
  {
    id: 'household-rent-split-calculator',
    name: 'Rent Split Calculator',
    shortDescription: 'Split roommate rent fairly based on room square footage, private bathrooms, balconies, and parking spots.',
    category: 'home',
    iconName: 'Users',
    keywords: ['rent split', 'roommate rent', 'fair rent calculator', 'room split'],
    offlineAvailable: true,
    instructions: [
      'Enter total monthly apartment rent.',
      'List roommates with their bedroom square footage.',
      'Toggle amenities like private bathrooms, balconies, or parking spaces to calculate balanced shares.'
    ],
    faqs: [
      {
        question: 'Why not split rent equally among roommates?',
        answer: 'Equal splits often feel unfair when one roommate has the master bedroom with an ensuite bathroom while another has a compact bedroom with a shared bath.'
      }
    ],
    relatedTools: ['household-monthly-budget-calculator', 'monthly-rent-splitter'],
    component: HouseholdRentSplitCalculator
  },
  // 12. Room Area Calculator
  {
    id: 'room-area-calculator',
    name: 'Room Area Calculator',
    shortDescription: 'Calculate floor surface area, room perimeter, and air conditioning ton requirements in feet or meters.',
    category: 'home',
    iconName: 'Maximize2',
    keywords: ['room area', 'square feet calculator', 'floor area', 'room dimensions'],
    offlineAvailable: true,
    instructions: [
      'Enter room length and width in feet or meters.',
      'View square footage, square meters, perimeter for baseboards, and AC cooling capacity.'
    ],
    faqs: [
      {
        question: 'How do I convert square feet to square meters?',
        answer: 'Multiply square feet by 0.092903, or divide square feet by 10.7639.'
      }
    ],
    relatedTools: ['room-volume-calculator', 'paint-quantity-calculator', 'tile-calculator'],
    component: RoomAreaCalculator
  },
  // 13. Room Volume Calculator
  {
    id: 'room-volume-calculator',
    name: 'Room Volume Calculator',
    shortDescription: 'Calculate room cubic volume for HVAC heating/cooling BTU sizing, airflow CFM requirements, and air purifiers.',
    category: 'home',
    iconName: 'Box',
    keywords: ['room volume', 'cubic feet', 'cubic meters', 'air purifier cadr', 'hvac btu'],
    offlineAvailable: true,
    instructions: [
      'Input room length, width, and ceiling height.',
      'View total cubic volume and recommended Clean Air Delivery Rate (CADR).'
    ],
    faqs: [
      {
        question: 'Why is room volume important for air purifiers?',
        answer: 'Air purifiers must cycle the entire room volume 4 to 5 times per hour (ACH) to effectively remove airborne pollutants and allergens.'
      }
    ],
    relatedTools: ['room-area-calculator'],
    component: RoomVolumeCalculator
  },
  // 14. Paint Quantity Calculator
  {
    id: 'paint-quantity-calculator',
    name: 'Paint Quantity Calculator',
    shortDescription: 'Calculate interior wall and ceiling paint liters, gallons, and primer required with window/door deductions.',
    category: 'home',
    iconName: 'Paintbrush',
    keywords: ['paint calculator', 'paint liters', 'wall paint gallons', 'paint coverage'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter room length, width, and ceiling height.',
      'Specify number of doors and windows to deduct.',
      'Choose number of coats and whether to include the ceiling.'
    ],
    faqs: [
      {
        question: 'How much area does 1 liter of paint cover?',
        answer: 'Standard interior emulsion covers approximately 100 to 120 square feet (9.3 to 11 m²) per liter for a single coat on primed walls.'
      }
    ],
    relatedTools: ['wallpaper-calculator', 'wall-area-calculator'],
    component: PaintQuantityCalculator
  },
  // 15. Wallpaper Calculator
  {
    id: 'wallpaper-calculator',
    name: 'Wallpaper Calculator',
    shortDescription: 'Estimate wallpaper rolls needed based on room perimeter, wall height, roll dimensions, pattern repeat, and wastage.',
    category: 'home',
    iconName: 'Grid',
    keywords: ['wallpaper rolls', 'wallpaper calculator', 'pattern repeat', 'wall covering'],
    offlineAvailable: true,
    instructions: [
      'Enter room dimensions and wall height.',
      'Input wallpaper roll width (inches) and roll length (feet).',
      'Set pattern repeat drop to compute exact usable strips and rolls needed.'
    ],
    faqs: [
      {
        question: 'What is wallpaper pattern repeat?',
        answer: 'Pattern repeat is the vertical distance between identical design motifs that must be aligned across adjacent wallpaper strips, resulting in cutting waste.'
      }
    ],
    relatedTools: ['paint-quantity-calculator', 'wall-area-calculator'],
    component: WallpaperCalculator
  },

  // 16. Cement Calculator
  {
    id: 'cement-calculator',
    name: 'Cement Calculator',
    shortDescription: 'Calculate 50kg cement bags required for concrete slabs, foundations, columns, and masonry mortar.',
    category: 'home',
    iconName: 'Hammer',
    keywords: ['cement bags', 'cement calculator', '50kg cement', 'mortar cement'],
    offlineAvailable: true,
    instructions: [
      'Enter target wet volume of concrete or mortar in cubic meters.',
      'Configure the mix ratio (Cement : Sand : Aggregate).',
      'Review total 50kg cement bags and dry volume requirements.'
    ],
    faqs: [
      {
        question: 'How many kg is in one bag of cement?',
        answer: 'The standard international construction packaging is 50 kg per bag, with an uncompacted volume of ~0.0347 m³ (1.23 cu ft).'
      }
    ],
    relatedTools: ['concrete-calculator', 'sand-quantity-calculator'],
    component: CementCalculator
  },
  // 17. Concrete Calculator
  {
    id: 'concrete-calculator',
    name: 'Concrete Calculator',
    shortDescription: 'Calculate wet volume, dry volume factor (1.54), cement bags, sand, and coarse aggregate for slabs and footings.',
    category: 'home',
    iconName: 'Layers',
    keywords: ['concrete volume', 'rcc calculator', 'concrete mix', 'slab concrete'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter length, width, and thickness of the slab or foundation.',
      'Choose concrete grade (M15 1:2:4, M20 1:1.5:3, or M25 1:1:2).',
      'Review itemized cement, sand, and aggregate quantities.'
    ],
    faqs: [
      {
        question: 'Why is dry volume multiplied by 1.54 in concrete?',
        answer: 'When water is added to dry cement, sand, and gravel, the fine particles fill the voids between coarse aggregate, causing ~54% volume reduction from dry to wet.'
      }
    ],
    relatedTools: ['cement-calculator', 'aggregate-calculator'],
    component: ConcreteCalculator
  },
  // 18. Brick Calculator
  {
    id: 'brick-calculator',
    name: 'Brick Calculator',
    shortDescription: 'Estimate standard bricks or concrete blocks needed for single or double leaf walls with mortar deductions and wastage.',
    category: 'home',
    iconName: 'Box',
    keywords: ['brick calculator', 'bricks needed', 'masonry estimator', 'wall bricks'],
    offlineAvailable: true,
    instructions: [
      'Enter wall length and height in meters.',
      'Select wall thickness (4.5" single leaf or 9" double leaf).',
      'Specify door and window opening deductions to view brick and mortar quantities.'
    ],
    faqs: [
      {
        question: 'How many bricks are in 1 cubic meter of masonry?',
        answer: 'Standard modular brickwork typically requires approximately 500 bricks per cubic meter including mortar joints.'
      }
    ],
    relatedTools: ['wall-area-calculator', 'plaster-calculator'],
    component: BrickCalculator
  },
  // 19. Sand Quantity Calculator
  {
    id: 'sand-quantity-calculator',
    name: 'Sand Quantity Calculator',
    shortDescription: 'Convert sand requirements between cubic feet, cubic meters, metric tons, and brass units.',
    category: 'home',
    iconName: 'Layers',
    keywords: ['sand calculator', 'fine aggregate', 'sand tons', 'brass sand'],
    offlineAvailable: true,
    instructions: [
      'Enter sand volume in cubic feet.',
      'Review converted metric volume (m³), weight in tons (density ~1600 kg/m³), and brass units.'
    ],
    faqs: [
      {
        question: 'What is 1 Brass of sand?',
        answer: 'In South Asian construction, 1 Brass equals exactly 100 cubic feet (approx 2.83 cubic meters).'
      }
    ],
    relatedTools: ['aggregate-calculator', 'cement-calculator'],
    component: SandQuantityCalculator
  },
  // 20. Aggregate Calculator
  {
    id: 'aggregate-calculator',
    name: 'Aggregate Calculator',
    shortDescription: 'Calculate coarse gravel and crushed stone quantities in cubic feet, cubic meters, tons, and brass.',
    category: 'home',
    iconName: 'Layers',
    keywords: ['aggregate calculator', 'gravel quantity', 'crushed stone tons', 'coarse aggregate'],
    offlineAvailable: true,
    instructions: [
      'Enter coarse aggregate volume in cubic feet.',
      'View metric volume, tonnage, and brass equivalents.'
    ],
    faqs: [
      {
        question: 'What is the bulk density of crushed aggregate?',
        answer: 'Standard crushed stone aggregate has a typical bulk density of 1,450 to 1,550 kg per cubic meter.'
      }
    ],
    relatedTools: ['sand-quantity-calculator', 'concrete-calculator'],
    component: AggregateCalculator
  },
  // 21. Tile Calculator
  {
    id: 'tile-calculator',
    name: 'Tile Calculator',
    shortDescription: 'Calculate floor and wall tile quantities, wastage allowance, boxes needed, and total material cost.',
    category: 'home',
    iconName: 'Grid',
    keywords: ['tile calculator', 'flooring tiles', 'bathroom tiles', 'tile boxes needed'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter room length and width in feet or meters.',
      'Input tile dimensions (cm or inches) and tiles per retail box.',
      'Add price per box to see total estimated cost.'
    ],
    faqs: [
      {
        question: 'Why add 10% to 15% tile wastage?',
        answer: 'Edge cuts, corner trimmings, pipe penetrations, and occasional shipping breakage require extra tiles above the raw surface area.'
      }
    ],
    relatedTools: ['flooring-cost-calculator', 'room-area-calculator'],
    component: TileCalculator
  },
  // 22. Flooring Cost Calculator
  {
    id: 'flooring-cost-calculator',
    name: 'Flooring Cost Calculator',
    shortDescription: 'Estimate hardwood, laminate, vinyl, or tile flooring costs including materials, underlayment, and labor.',
    category: 'home',
    iconName: 'DollarSign',
    keywords: ['flooring cost', 'hardwood cost', 'laminate estimator', 'flooring installation'],
    offlineAvailable: true,
    instructions: [
      'Enter floor area in square feet.',
      'Specify material price per sq ft, underlayment, and installation labor rate.'
    ],
    faqs: [
      {
        question: 'Does flooring cost include underlayment?',
        answer: 'Our calculator itemizes materials, moisture barrier underlayment, and labor separately for complete clarity.'
      }
    ],
    relatedTools: ['tile-calculator', 'room-area-calculator'],
    component: FlooringCostCalculator
  },
  // 23. Wall Area Calculator
  {
    id: 'wall-area-calculator',
    name: 'Wall Area Calculator',
    shortDescription: 'Calculate net vertical wall surface area by deducting doors, windows, and archway openings.',
    category: 'home',
    iconName: 'Ruler',
    keywords: ['wall area', 'net wall area', 'door deduction', 'window deduction'],
    offlineAvailable: true,
    instructions: [
      'Input total running wall length and room ceiling height.',
      'Input door and window counts to subtract aperture areas.'
    ],
    faqs: [
      {
        question: 'What is the standard area of an interior door?',
        answer: 'A standard 3ft × 7ft interior door represents 21 square feet of wall deduction.'
      }
    ],
    relatedTools: ['paint-quantity-calculator', 'brick-calculator'],
    component: WallAreaCalculator
  },
  // 24. Plaster Calculator
  {
    id: 'plaster-calculator',
    name: 'Plaster Calculator',
    shortDescription: 'Calculate cement and sand quantities for interior (12mm) and exterior (15-20mm) wall plastering.',
    category: 'home',
    iconName: 'Paintbrush',
    keywords: ['plaster calculator', 'wall plaster cement', 'plaster sand', 'mortar ratio'],
    offlineAvailable: true,
    instructions: [
      'Enter wall plastering area in square meters.',
      'Select plaster thickness (12mm interior or 15-20mm exterior).',
      'Choose mix ratio (1:4 or 1:6) to compute cement bags and sand volume.'
    ],
    faqs: [
      {
        question: 'What is the standard thickness for internal wall plaster?',
        answer: 'Standard internal brick wall plastering is applied at 12 mm thickness, with dry volume conversion factor of 1.33.'
      }
    ],
    relatedTools: ['cement-calculator', 'wall-area-calculator'],
    component: PlasterCalculator
  },
  // 25. Roofing Material Calculator
  {
    id: 'roofing-material-calculator',
    name: 'Roofing Material Calculator',
    shortDescription: 'Calculate pitched roof area, roofing squares, asphalt shingle bundles, and underlayment rolls.',
    category: 'home',
    iconName: 'Home',
    keywords: ['roofing calculator', 'shingle bundles', 'roof pitch multiplier', 'roofing squares'],
    offlineAvailable: true,
    instructions: [
      'Enter building footprint length and width.',
      'Select roof pitch slope (e.g. 4/12 or 6/12).',
      'Review roofing squares, shingle bundles, and underlayment rolls.'
    ],
    faqs: [
      {
        question: 'What is a roofing square?',
        answer: 'One roofing square equals exactly 100 square feet of finished roof surface area.'
      }
    ],
    relatedTools: ['construction-cost-estimator'],
    component: RoofingMaterialCalculator
  },
  // 26. Staircase Calculator
  {
    id: 'staircase-calculator',
    name: 'Staircase Calculator',
    shortDescription: 'Calculate stair step count, riser height, tread run, stringer length, and incline angle with Blondel comfort check.',
    category: 'home',
    iconName: 'Ruler',
    keywords: ['stair calculator', 'riser and tread', 'staircase stringer', 'step height'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter total floor-to-floor rise height in inches.',
      'Adjust target riser height (ideal 7" to 7.75") and tread depth (ideal 11").',
      'Review step count, stringer length, and architectural Blondel comfort verification.'
    ],
    faqs: [
      {
        question: 'What is Blondel’s Rule for comfortable stairs?',
        answer: 'Francois Blondel’s historical ergonomic formula states: 2 × Riser + Tread should equal 24 to 25.5 inches for optimal walking comfort.'
      }
    ],
    relatedTools: ['room-dimensions-calculator', 'construction-cost-estimator'],
    component: StaircaseCalculator
  },
  // 27. Door & Window Area Calculator
  {
    id: 'door-window-area-calculator',
    name: 'Door & Window Area Calculator',
    shortDescription: 'Compile architectural fenestration schedules and calculate total glazed glass opening area.',
    category: 'home',
    iconName: 'Maximize2',
    keywords: ['door schedule', 'window schedule', 'glazing area', 'aperture area'],
    offlineAvailable: true,
    instructions: [
      'Enter door dimensions and quantities.',
      'Input window dimensions and quantities to view cumulative glazed square footage.'
    ],
    faqs: [
      {
        question: 'Why calculate door and window schedules?',
        answer: 'Accurate aperture schedules are essential for HVAC thermal heat gain calculations and masonry opening deductions.'
      }
    ],
    relatedTools: ['wall-area-calculator'],
    component: DoorWindowAreaCalculator
  },
  // 28. Construction Cost Estimator
  {
    id: 'construction-cost-estimator',
    name: 'Construction Cost Estimator',
    shortDescription: 'Forecast residential construction costs by built-up area across structure, finishes, plumbing, electrical, and contingency.',
    category: 'home',
    iconName: 'Building',
    keywords: ['construction cost', 'house building cost', 'plinth area rate', 'building estimate'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter total built-up plinth area in square feet.',
      'Choose construction quality grade (Economy, Standard, or Luxury).',
      'Review itemized cost distributions across grey structure and finishing works.'
    ],
    faqs: [
      {
        question: 'What percentage of construction is grey structure?',
        answer: 'The grey structure (excavation, foundation, RCC pillars, beams, and masonry brickwork) typically accounts for 40% to 45% of total building cost.'
      }
    ],
    relatedTools: ['renovation-budget-planner', 'construction-material-cost-calculator'],
    component: ConstructionCostEstimator
  },
  // 29. Material Cost Calculator
  {
    id: 'construction-material-cost-calculator',
    name: 'Material Cost Calculator',
    shortDescription: 'Calculate itemized Bill of Quantities (BOQ) material rates and cost totals for ongoing construction sites.',
    category: 'home',
    iconName: 'DollarSign',
    keywords: ['material cost', 'construction boq', 'building materials tally', 'cement steel rate'],
    offlineAvailable: true,
    instructions: [
      'Review standard materials (cement, rebar, sand, gravel, bricks).',
      'Update quantities and local market unit rates to compute total procurement cost.'
    ],
    faqs: [
      {
        question: 'What is a Bill of Quantities (BOQ)?',
        answer: 'A detailed itemized document in construction specifying materials, parts, and labor terms used for budgeting and contractor contracts.'
      }
    ],
    relatedTools: ['construction-cost-estimator'],
    component: ConstructionMaterialCostCalculator
  },
  // 30. Renovation Budget Planner
  {
    id: 'renovation-budget-planner',
    name: 'Renovation Budget Planner',
    shortDescription: 'Plan kitchen, bathroom, or whole-house remodel budgets with demolition, materials, labor, and contingency reserves.',
    category: 'home',
    iconName: 'Hammer',
    keywords: ['renovation budget', 'kitchen remodel cost', 'bathroom remodel', 'home remodel planner'],
    offlineAvailable: true,
    instructions: [
      'Enter estimated costs for demolition, cabinetry, countertops, fixtures, and labor.',
      'Set contingency reserve percentage (recommended 15-20%) to prevent project overruns.'
    ],
    faqs: [
      {
        question: 'Why is a contingency reserve vital in home renovations?',
        answer: 'Opening older walls frequently uncovers hidden plumbing leaks, outdated wiring, or termite damage requiring unforeseen repairs.'
      }
    ],
    relatedTools: ['construction-cost-estimator', 'flooring-cost-calculator'],
    component: RenovationBudgetPlanner
  },

  // 31. Household Chore Planner
  {
    id: 'household-chore-planner',
    name: 'Household Chore Planner',
    shortDescription: 'Manage household chore lists, room assignments, family member responsibilities, and completion tracking.',
    category: 'home',
    iconName: 'CheckSquare',
    keywords: ['chore planner', 'family chores', 'household tasks', 'chore board'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Add chores with room location, assignee, and frequency.',
      'Check off chores when completed.',
      'Print or review chore progress locally.'
    ],
    faqs: [
      {
        question: 'Where is chore data stored?',
        answer: 'All chore plans are stored 100% locally on your device in IndexedDB (`lifetools_household_db`).'
      }
    ],
    relatedTools: ['cleaning-schedule-generator', 'daily-cleaning-checklist'],
    component: HouseholdChorePlanner
  },
  // 32. Cleaning Schedule Generator
  {
    id: 'cleaning-schedule-generator',
    name: 'Cleaning Schedule Generator',
    shortDescription: 'Generate balanced day-by-day cleaning routines from Monday to Sunday to keep your home tidy without burnout.',
    category: 'home',
    iconName: 'Sparkles',
    keywords: ['cleaning schedule', 'weekly cleaning routine', 'house cleaning plan', 'cleaning rota'],
    offlineAvailable: true,
    instructions: [
      'Select days of the week to inspect targeted room routines.',
      'Follow the curated 3-step focus tasks each day.'
    ],
    faqs: [
      {
        question: 'How does daily zone cleaning prevent burnout?',
        answer: 'Focusing on one specific room each day (15-30 minutes) eliminates exhausting 6-hour weekend cleaning marathons.'
      }
    ],
    relatedTools: ['daily-cleaning-checklist', 'household-chore-planner'],
    component: CleaningScheduleGenerator
  },
  // 33. Daily Cleaning Checklist
  {
    id: 'daily-cleaning-checklist',
    name: 'Daily Cleaning Checklist',
    shortDescription: 'High-yield 15-minute daily home reset checklist covering beds, sinks, counters, and clutter resets.',
    category: 'home',
    iconName: 'CheckSquare',
    keywords: ['daily cleaning', 'daily reset checklist', 'quick house clean', '15 min clean'],
    offlineAvailable: true,
    instructions: [
      'Complete high-impact daily habits (make bed, wipe kitchen counters, sink reset).',
      'Check off items throughout the day.'
    ],
    faqs: [
      {
        question: 'What is a night-time clutter reset?',
        answer: 'A 10-minute sweep before bed returning rogue items to their rooms, wiping counters, and clearing the sink for a peaceful morning.'
      }
    ],
    relatedTools: ['cleaning-schedule-generator'],
    component: DailyCleaningChecklist
  },
  // 34. Weekly Cleaning Planner
  {
    id: 'weekly-cleaning-planner',
    name: 'Weekly Cleaning Planner',
    shortDescription: 'Plan rotating weekly deep cleans across living rooms, bathrooms, kitchens, and bedrooms.',
    category: 'home',
    iconName: 'Calendar',
    keywords: ['weekly cleaning', 'deep clean planner', 'bathroom cleaning schedule'],
    offlineAvailable: true,
    instructions: ['Follow daily rotating cleaning focus zones throughout the week.'],
    faqs: [{ question: 'How often should bed sheets be washed?', answer: 'Dermatologists recommend washing bed linens once every 7 to 10 days in warm/hot water.' }],
    relatedTools: ['cleaning-schedule-generator', 'laundry-schedule-planner'],
    component: WeeklyCleaningPlanner
  },
  // 35. Monthly Cleaning Planner
  {
    id: 'monthly-cleaning-planner',
    name: 'Monthly Cleaning Planner',
    shortDescription: 'Track monthly and seasonal home care tasks: refrigerator coils, washing machine tubs, baseboards, and detectors.',
    category: 'home',
    iconName: 'Calendar',
    keywords: ['monthly cleaning', 'seasonal home maintenance', 'deep clean checklist'],
    offlineAvailable: true,
    instructions: ['Inspect and check off monthly deep cleaning and appliance maintenance items.'],
    faqs: [{ question: 'Why clean refrigerator condenser coils?', answer: 'Dust on condenser coils forces the compressor to run hotter and longer, consuming up to 30% more power.' }],
    relatedTools: ['home-maintenance-tracker', 'daily-cleaning-checklist'],
    component: MonthlyCleaningPlanner
  },
  // 36. Laundry Schedule
  {
    id: 'laundry-schedule-planner',
    name: 'Laundry Schedule',
    shortDescription: 'Organize household laundry days across darks, whites, bed sheets, and towels with wash temperature guides.',
    category: 'home',
    iconName: 'Layers',
    keywords: ['laundry schedule', 'washing machine routine', 'bed sheet washing', 'laundry organizer'],
    offlineAvailable: true,
    instructions: ['Review dedicated wash days and optimal water temperatures to preserve fabrics and sanitize linens.'],
    faqs: [{ question: 'What water temperature is best for towels?', answer: 'Hot water (60°C / 140°F) kills bacteria and eliminates damp mildew odors from bath towels.' }],
    relatedTools: ['weekly-cleaning-planner'],
    component: LaundrySchedulePlanner
  },
  // 37. Grocery Inventory Manager
  {
    id: 'grocery-inventory-manager',
    name: 'Grocery Inventory Manager',
    shortDescription: 'Manage pantry, fridge, and grocery stock with quantities, categories, and expiration monitoring.',
    category: 'home',
    iconName: 'ShoppingBag',
    keywords: ['grocery inventory', 'pantry stock', 'food inventory', 'kitchen supplies'],
    offlineAvailable: true,
    instructions: [
      'Add grocery items with location (pantry, fridge, freezer).',
      'Record quantities and track usage to prevent duplicate purchases.'
    ],
    faqs: [{ question: 'Where is grocery inventory stored?', answer: 'All inventory data is stored locally in IndexedDB on your device.' }],
    relatedTools: ['household-shopping-list', 'pantry-inventory-tracker'],
    component: GroceryInventoryManager
  },
  // 38. Pantry Inventory Tracker
  {
    id: 'pantry-inventory-tracker',
    name: 'Pantry Inventory Tracker',
    shortDescription: 'Track shelf-stable grains, canned goods, spices, and baking staples to eliminate kitchen waste.',
    category: 'home',
    iconName: 'Package',
    keywords: ['pantry tracker', 'dry food storage', 'pantry staples', 'food stock'],
    offlineAvailable: true,
    instructions: ['Monitor dry pantry goods and shelf-life status.'],
    faqs: [{ question: 'How long do dry beans and rice last in a pantry?', answer: 'Stored in airtight containers in a cool, dry place, white rice and dried beans last up to 2-3 years.' }],
    relatedTools: ['grocery-inventory-manager', 'refrigerator-inventory-tracker'],
    component: PantryInventoryTracker
  },
  // 39. Refrigerator Inventory Tracker
  {
    id: 'refrigerator-inventory-tracker',
    name: 'Refrigerator Inventory Tracker',
    shortDescription: 'Monitor perishable food in your fridge and freezer with expiration warnings to prevent spoilage.',
    category: 'home',
    iconName: 'Box',
    keywords: ['fridge inventory', 'freezer food tracker', 'food waste prevention', 'perishable items'],
    offlineAvailable: true,
    instructions: ['Log refrigerated foods and track expiry dates.'],
    faqs: [{ question: 'What is the safe temperature for a home refrigerator?', answer: 'Food safety agencies recommend maintaining refrigerator temperature between 1°C and 4°C (34°F to 40°F).' }],
    relatedTools: ['grocery-inventory-manager'],
    component: RefrigeratorInventoryTracker
  },
  // 40. Household Shopping List
  {
    id: 'household-shopping-list',
    name: 'Household Shopping List',
    shortDescription: 'Organize grocery and household shopping by department categories with interactive check-off mode.',
    category: 'home',
    iconName: 'ShoppingBag',
    keywords: ['shopping list', 'grocery checklist', 'market list', 'household supplies'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Add items with aisle department categories.',
      'Check off items as you place them into your shopping cart.'
    ],
    faqs: [{ question: 'Can I use this list offline in the supermarket?', answer: 'Yes! LifeTools PWA caches offline so your shopping checklist works without cellular reception.' }],
    relatedTools: ['grocery-inventory-manager'],
    component: HouseholdShoppingList
  },
  // 41. Home Inventory Manager
  {
    id: 'home-inventory-manager',
    name: 'Home Inventory Manager',
    shortDescription: 'Catalog high-value home assets, electronics, appliances, serial numbers, and estimated values for insurance claims.',
    category: 'home',
    iconName: 'Home',
    keywords: ['home inventory', 'insurance asset tracker', 'serial number registry', 'property inventory'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Catalog household belongings by room.',
      'Record serial numbers, purchase prices, and estimated replacement values.'
    ],
    faqs: [{ question: 'Why is a home inventory critical for insurance?', answer: 'In case of fire, flood, or burglary, insurers require proof of possession, make/model, and valuation to settle claims.' }],
    relatedTools: ['warranty-expiry-reminder'],
    component: HomeInventoryManager
  },
  // 42. Furniture Measurement Planner
  {
    id: 'furniture-measurement-planner',
    name: 'Furniture Measurement Planner',
    shortDescription: 'Verify whether sofas, tables, and mattresses will clear doorways, stairwells, and elevator dimensions before buying.',
    category: 'home',
    iconName: 'Ruler',
    keywords: ['furniture fit', 'doorway clearance', 'will it fit', 'sofa measurement'],
    offlineAvailable: true,
    instructions: [
      'Enter furniture width, depth, and diagonal height.',
      'Enter doorway clearance opening to verify passage feasibility.'
    ],
    faqs: [{ question: 'What is the minimum door width to fit a standard couch?', answer: 'Most standard 3-seater sofas require at least a 32-inch wide doorway when maneuvered vertically.' }],
    relatedTools: ['room-layout-planner', 'storage-space-calculator'],
    component: FurnitureMeasurementPlanner
  },
  // 43. Room Layout Planner
  {
    id: 'room-layout-planner',
    name: 'Room Layout Planner',
    shortDescription: 'Plan spatial clearances, walkway ergonomics, and furniture arrangements for living rooms and home offices.',
    category: 'home',
    iconName: 'Maximize2',
    keywords: ['room layout', 'furniture arrangement', 'space clearance', 'floor layout'],
    offlineAvailable: true,
    instructions: ['Plan room arrangements with standard 30 to 36-inch major walkway clearance rules.'],
    faqs: [{ question: 'What is standard walkway clearance in interior design?', answer: 'Interior designers recommend leaving at least 30 to 36 inches (75-90 cm) for primary walking corridors.' }],
    relatedTools: ['furniture-measurement-planner', 'room-area-calculator'],
    component: RoomLayoutPlanner
  },
  // 44. Storage Space Calculator
  {
    id: 'storage-space-calculator',
    name: 'Storage Space Calculator',
    shortDescription: 'Estimate self-storage unit dimensions (5x5, 10x10, 10x20) from box counts and bulky furniture items.',
    category: 'home',
    iconName: 'Box',
    keywords: ['storage unit size', 'cubic feet calculator', 'storage space estimator', 'moving boxes volume'],
    offlineAvailable: true,
    instructions: [
      'Input number of moving boxes, beds, and sofas.',
      'View estimated total cubic volume and recommended storage unit rental size.'
    ],
    faqs: [{ question: 'How much fits in a 10x10 storage unit?', answer: 'A 10x10 unit (100 sq ft / ~800 cu ft) typically holds the contents of an entire 1 to 2 bedroom apartment.' }],
    relatedTools: ['moving-house-checklist'],
    component: StorageSpaceCalculator
  },
  // 45. Moving House Checklist
  {
    id: 'moving-house-checklist',
    name: 'Moving House Checklist',
    shortDescription: 'Chronological relocation countdown checklist: 8 weeks prior, utility transfers, packing, and moving day walkthrough.',
    category: 'home',
    iconName: 'Truck',
    keywords: ['moving checklist', 'relocation planner', 'moving house countdown', 'moving day checklist'],
    isPopular: true,
    offlineAvailable: true,
    instructions: ['Work through chronological moving milestones from 8 weeks out through moving day.'],
    faqs: [{ question: 'When should utility transfers be scheduled?', answer: 'Contact power, water, and broadband providers 2 to 4 weeks prior to ensure services are live on move-in day.' }],
    relatedTools: ['storage-space-calculator', 'home-inventory-manager'],
    component: MovingHouseChecklist
  },

  // 46. Home Maintenance Tracker
  {
    id: 'home-maintenance-tracker',
    name: 'Home Maintenance Tracker',
    shortDescription: 'Track recurring home servicing schedules, costs, service providers, and upcoming preventative inspections.',
    category: 'home',
    iconName: 'Wrench',
    keywords: ['home maintenance', 'property upkeep log', 'service records', 'preventative maintenance'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Log recurring maintenance jobs with frequency and due dates.',
      'Track service history, costs, and contractor contact notes.'
    ],
    faqs: [{ question: 'How much should homeowners budget for annual maintenance?', answer: 'The general rule of thumb recommends budgeting 1% to 2% of your home’s market value per year for routine maintenance.' }],
    relatedTools: ['home-repair-expense-tracker', 'appliance-maintenance-reminder'],
    component: HomeMaintenanceTracker
  },
  // 47. Appliance Maintenance Reminder
  {
    id: 'appliance-maintenance-reminder',
    name: 'Appliance Maintenance Reminder',
    shortDescription: 'Maintain refrigerator defrosters, dryer lint ducts, dishwasher filters, and oven seals on schedule.',
    category: 'home',
    iconName: 'Clock',
    keywords: ['appliance care', 'dryer vent cleaning', 'dishwasher filter maintenance', 'appliance schedule'],
    offlineAvailable: true,
    instructions: ['Track appliance cleaning intervals to prolong appliance lifespans.'],
    faqs: [{ question: 'Why clean dryer exhaust vents annually?', answer: 'Lint buildup in dryer exhaust ducts is one of the leading causes of residential structural fires.' }],
    relatedTools: ['home-maintenance-tracker', 'filter-replacement-reminder'],
    component: ApplianceMaintenanceReminder
  },
  // 48. AC Service Reminder
  {
    id: 'ac-service-reminder',
    name: 'AC Service Reminder',
    shortDescription: 'Air conditioning care schedule: 30-day air mesh filter washing and 6-month chemical coil servicing.',
    category: 'home',
    iconName: 'Wrench',
    keywords: ['ac service', 'air conditioner cleaning', 'hvac filter schedule', 'coil cleaning'],
    offlineAvailable: true,
    instructions: ['Inspect AC maintenance schedules and recommended service cycles.'],
    faqs: [{ question: 'How often should AC mesh filters be cleaned?', answer: 'In urban environments, washing mesh filters every 30 days preserves cooling efficiency and reduces electric draw.' }],
    relatedTools: ['filter-replacement-reminder', 'home-maintenance-tracker'],
    component: AcServiceReminder
  },
  // 49. Home Equipment Maintenance Tracker
  {
    id: 'home-equipment-maintenance-tracker',
    name: 'Home Equipment Maintenance Tracker',
    shortDescription: 'Track generator oil changes, lawn mower blade sharpening, and power tool servicing schedules.',
    category: 'home',
    iconName: 'Wrench',
    keywords: ['equipment maintenance', 'generator oil change', 'lawn mower service', 'power tools upkeep'],
    offlineAvailable: true,
    instructions: ['Log runtime hours and service dates for backup generators and yard equipment.'],
    faqs: [{ question: 'How often does a backup generator need an oil change?', answer: 'Standby generators generally require fresh oil and filter replacement every 100 to 200 runtime hours or once a year.' }],
    relatedTools: ['home-maintenance-tracker'],
    component: HomeEquipmentMaintenanceTracker
  },
  // 50. Plumbing Maintenance Checklist
  {
    id: 'plumbing-maintenance-checklist',
    name: 'Plumbing Maintenance Checklist',
    shortDescription: 'Preventative plumbing inspection checklist: P-traps, water heater flushes, aerators, and supply lines.',
    category: 'home',
    iconName: 'Droplets',
    keywords: ['plumbing inspection', 'water leak check', 'toilet flapper test', 'water heater flush'],
    offlineAvailable: true,
    instructions: ['Inspect sinks, toilets, shutoff valves, and water heaters on a quarterly basis.'],
    faqs: [{ question: 'Why flush a water heater tank?', answer: 'Flushing sediment buildup from the bottom of the tank prevents heating element burnout and restores water pressure.' }],
    relatedTools: ['water-tank-cleaning-reminder'],
    component: PlumbingMaintenanceChecklist
  },
  // 51. Electrical Maintenance Checklist
  {
    id: 'electrical-maintenance-checklist',
    name: 'Electrical Maintenance Checklist',
    shortDescription: 'Home electrical safety checklist: GFCI outlet tests, circuit breaker inspection, and smoke alarm batteries.',
    category: 'home',
    iconName: 'Zap',
    keywords: ['electrical inspection', 'gfci outlet test', 'smoke detector check', 'home electrical safety'],
    offlineAvailable: true,
    instructions: ['Test GFCI breakers monthly and replace smoke detector batteries semi-annually.'],
    faqs: [{ question: 'How do you test a GFCI outlet?', answer: 'Press the "TEST" button: the "RESET" button should pop out, cutting power. Press "RESET" to restore power.' }],
    relatedTools: ['home-maintenance-tracker'],
    component: ElectricalMaintenanceChecklist
  },
  // 52. Water Tank Cleaning Reminder
  {
    id: 'water-tank-cleaning-reminder',
    name: 'Water Tank Cleaning Reminder',
    shortDescription: 'Schedule semi-annual disinfection, sediment removal, and chlorination for overhead and underground water storage tanks.',
    category: 'home',
    iconName: 'Droplets',
    keywords: ['water tank cleaning', 'overhead tank disinfection', 'water reservoir chlorination'],
    offlineAvailable: true,
    instructions: ['Record tank volume and monitor 6-month cleaning cycles for safe domestic water.'],
    faqs: [{ question: 'How often should residential water tanks be disinfected?', answer: 'Health authorities recommend deep cleaning and chlorinating domestic water tanks at least once every 6 months.' }],
    relatedTools: ['plumbing-maintenance-checklist', 'monthly-water-bill-estimator'],
    component: WaterTankCleaningReminder
  },
  // 53. Filter Replacement Reminder
  {
    id: 'filter-replacement-reminder',
    name: 'Filter Replacement Reminder',
    shortDescription: 'Track replacement deadlines for HVAC filters, refrigerator drinking water filters, RO units, and range hood grease screens.',
    category: 'home',
    iconName: 'ShieldCheck',
    keywords: ['filter replacement', 'hvac filter reminder', 'water filter schedule', 'hepa replacement'],
    offlineAvailable: true,
    instructions: ['Monitor manufacturer replacement intervals for all residential air and water filters.'],
    faqs: [{ question: 'How often should refrigerator water filters be changed?', answer: 'Most manufacturers recommend replacing refrigerator carbon water filters every 6 months to maintain filtration capacity.' }],
    relatedTools: ['ac-service-reminder'],
    component: FilterReplacementReminder
  },
  // 54. Home Repair Expense Tracker
  {
    id: 'home-repair-expense-tracker',
    name: 'Home Repair Expense Tracker',
    shortDescription: 'Track home improvement and emergency repair expenditures with contractor details, categories, and totals.',
    category: 'home',
    iconName: 'DollarSign',
    keywords: ['repair expenses', 'home repair log', 'handyman expenses', 'home improvement ledger'],
    offlineAvailable: true,
    instructions: [
      'Log repair descriptions, costs, and contractor names.',
      'Review total maintenance spend for tax deductions or resale cost basis.'
    ],
    faqs: [{ question: 'Can home repairs be deducted from property capital gains?', answer: 'Capital home improvements (roofs, HVAC replacements, additions) can be added to your property cost basis to reduce capital gains tax upon resale.' }],
    relatedTools: ['home-maintenance-tracker', 'property-expense-tracker'],
    component: HomeRepairExpenseTracker
  },
  // 55. Warranty Expiry Reminder
  {
    id: 'warranty-expiry-reminder',
    name: 'Warranty Expiry Reminder',
    shortDescription: 'Log appliance and electronics purchase dates, warranty coverage terms, and manufacturer claim deadlines.',
    category: 'home',
    iconName: 'Clock',
    keywords: ['warranty tracker', 'guarantee expiration', 'appliance warranty', 'warranty claim'],
    offlineAvailable: true,
    instructions: ['Record appliance purchase dates and warranty durations to ensure free servicing before expiration.'],
    faqs: [{ question: 'What is standard manufacturer warranty duration?', answer: 'Most major home appliances come with a 1-year comprehensive warranty, with extended 5 to 10-year coverage on sealed compressors and motors.' }],
    relatedTools: ['home-inventory-manager'],
    component: WarrantyExpiryReminder
  },

  // 56. Property Area Converter
  {
    id: 'property-area-converter',
    name: 'Property Area Converter',
    shortDescription: 'Universal real estate area converter: Square Feet, Square Meters, Acres, Hectares, Kanal, Marla, Bigha, Guntha, and Cent.',
    category: 'home',
    iconName: 'ArrowLeftRight',
    keywords: ['property area', 'land converter', 'kanal to marla', 'bigha converter', 'acre to kanal'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter land measurement value and select source unit.',
      'Configure Kanal/Marla basis standard (Modern 225 sq ft vs Cadastral 272.25 sq ft).',
      'View synchronized real-time area across 11 land units.'
    ],
    faqs: [
      {
        question: 'Why does Marla size vary regionally?',
        answer: 'Modern planned housing authorities (like LDA and DHA) standardized 1 Marla to 225 sq ft, while historical British land revenue cadastral records define 1 Marla as 272.25 sq ft (9 square karams).'
      }
    ],
    relatedTools: ['square-feet-to-square-meter-converter', 'kanal-to-marla-converter', 'acre-to-kanal-converter'],
    component: PropertyAreaConverter
  },
  // 57. Square Feet to Square Meter Converter
  {
    id: 'square-feet-to-square-meter-converter',
    name: 'Square Feet to Square Meter Converter',
    shortDescription: 'High-precision bidirectional converter between imperial Square Feet and metric Square Meters.',
    category: 'home',
    iconName: 'ArrowLeftRight',
    keywords: ['sq ft to sq m', 'square feet to meters', 'floor area conversion', 'metric land'],
    offlineAvailable: true,
    instructions: ['Enter square feet to view instant square meters (1 m² = 10.76391 sq ft).'],
    faqs: [{ question: 'What is the exact conversion ratio?', answer: '1 Square Meter equals 10.7639104 Square Feet. Conversely, 1 Square Foot equals 0.092903 Square Meters.' }],
    relatedTools: ['property-area-converter', 'marla-to-square-feet-converter'],
    component: SquareFeetToSquareMeterConverter
  },
  // 58. Acre to Kanal Converter
  {
    id: 'acre-to-kanal-converter',
    name: 'Acre to Kanal Converter',
    shortDescription: 'Convert agricultural and urban land between Acres and Kanals across revenue cadastral and modern housing standards.',
    category: 'home',
    iconName: 'ArrowLeftRight',
    keywords: ['acre to kanal', 'kanals in an acre', 'land acreage', 'pakistan land measurement'],
    offlineAvailable: true,
    instructions: ['Input acres and select Cadastral Revenue (8 Kanals/Acre) or Modern Housing (9.68 Kanals/Acre) standard.'],
    faqs: [{ question: 'How many Kanals are in 1 Acre?', answer: 'In historical Land Revenue records, 1 Acre (43,560 sq ft) equals exactly 8 Kanals of 20 Marlas each (272.25 sq ft per Marla).' }],
    relatedTools: ['kanal-to-marla-converter', 'property-area-converter'],
    component: AcreToKanalConverter
  },
  // 59. Kanal to Marla Converter
  {
    id: 'kanal-to-marla-converter',
    name: 'Kanal to Marla Converter',
    shortDescription: 'Convert between Kanals and Marlas using the standard rule of 20 Marlas per Kanal.',
    category: 'home',
    iconName: 'ArrowLeftRight',
    keywords: ['kanal to marla', 'marlas in kanal', 'plot size conversion'],
    offlineAvailable: true,
    instructions: ['Enter Kanals to view equivalent Marla units (1 Kanal = 20 Marla universally).'],
    faqs: [{ question: 'Is 1 Kanal always 20 Marlas?', answer: 'Yes, the 1 Kanal = 20 Marlas ratio is constant across all regional systems; only the square footage of the underlying Marla differs.' }],
    relatedTools: ['marla-to-square-feet-converter', 'property-area-converter'],
    component: KanalToMarlaConverter
  },
  // 60. Marla to Square Feet Converter
  {
    id: 'marla-to-square-feet-converter',
    name: 'Marla to Square Feet Converter',
    shortDescription: 'Convert Marlas to Square Feet with selectable standards: Modern LDA (225 sq ft), Revenue (272.25 sq ft), or Commercial (200 sq ft).',
    category: 'home',
    iconName: 'ArrowLeftRight',
    keywords: ['marla to sq ft', '5 marla in sq ft', '10 marla plot size', 'marla square feet'],
    offlineAvailable: true,
    instructions: ['Enter Marlas and select standard definition to view total square feet and square yards.'],
    faqs: [{ question: 'How many square feet is a 5 Marla plot?', answer: 'In modern housing societies (LDA/DHA), a 5 Marla plot is 1,125 sq ft (approx 25x45 ft). Under the revenue standard, it is 1,361.25 sq ft.' }],
    relatedTools: ['property-area-converter', 'kanal-to-marla-converter'],
    component: MarlaToSquareFeetConverter
  },
  // 61. Property Price Calculator
  {
    id: 'property-price-calculator',
    name: 'Property Price Calculator',
    shortDescription: 'Calculate real estate plot value with unit rates, corner plot premiums, park-facing surcharges, and development fees.',
    category: 'home',
    iconName: 'Calculator',
    keywords: ['property price', 'plot cost calculator', 'real estate valuation', 'corner plot premium'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter plot area and unit rate.',
      'Toggle location premiums (corner plot +10%, park facing +5%, main road +10%).',
      'Add development fees to view total acquisition cost.'
    ],
    faqs: [{ question: 'Why do corner plots cost more?', answer: 'Corner plots offer dual road access, better natural ventilation, enhanced parking, and greater commercial viability, usually commanding a 10% premium.' }],
    relatedTools: ['property-registration-expense-estimator', 'rental-yield-calculator'],
    component: PropertyPriceCalculator
  },
  // 62. Property Registration Expense Estimator
  {
    id: 'property-registration-expense-estimator',
    name: 'Property Registration Expense Estimator',
    shortDescription: 'Estimate closing costs: Stamp Duty, Registration Fees, Mutation Taxes, Transfer Fees, and legal paperwork dues.',
    category: 'home',
    iconName: 'Percent',
    keywords: ['registration fee', 'stamp duty calculator', 'property transfer tax', 'closing costs'],
    offlineAvailable: true,
    instructions: [
      'Enter assessed market value of property.',
      'Adjust statutory Stamp Duty and Registration percentages to view total closing expenses.'
    ],
    faqs: [{ question: 'What is Stamp Duty?', answer: 'Stamp duty is a government tax levied on legal property transfer deeds to make the ownership title legally enforceable.' }],
    relatedTools: ['property-price-calculator'],
    component: PropertyRegistrationExpenseEstimator
  },
  // 63. Rental Yield Calculator
  {
    id: 'rental-yield-calculator',
    name: 'Rental Yield Calculator',
    shortDescription: 'Calculate Gross and Net Rental Yield percentages accounting for maintenance, property taxes, insurance, and vacancy rates.',
    category: 'home',
    iconName: 'TrendingUp',
    keywords: ['rental yield', 'gross yield', 'net rental yield', 'landlord return', 'roi property'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter property purchase price and monthly rent.',
      'Input annual maintenance, property tax, and vacancy rate.',
      'Compare Gross Yield and Net Yield percentages.'
    ],
    faqs: [{ question: 'What is a good net rental yield?', answer: 'A residential net rental yield between 5% and 8% is generally considered strong in most stable real estate markets.' }],
    relatedTools: ['property-investment-calculator', 'property-mortgage-calculator'],
    component: RentalYieldCalculator
  },
  // 64. Monthly Rent Splitter
  {
    id: 'monthly-rent-splitter',
    name: 'Monthly Rent Splitter',
    shortDescription: 'Split monthly apartment rent and shared utilities equally or proportionally across tenants.',
    category: 'home',
    iconName: 'Users',
    keywords: ['rent splitter', 'split rent', 'roommate utility share'],
    offlineAvailable: true,
    instructions: ['Enter monthly rent, shared utilities, and number of tenants.'],
    faqs: [{ question: 'Can utilities be included in rent splits?', answer: 'Yes! Our tool factors combined rent and utility disbursements to give exact per-person monthly dues.' }],
    relatedTools: ['household-rent-split-calculator'],
    component: MonthlyRentSplitter
  },
  // 65. Security Deposit Calculator
  {
    id: 'security-deposit-calculator',
    name: 'Security Deposit Calculator',
    shortDescription: 'Calculate refundable lease security deposits, pet deposits, key fees, and statutory interest obligations.',
    category: 'home',
    iconName: 'DollarSign',
    keywords: ['security deposit', 'rental deposit', 'pet deposit', 'lease move-in cost'],
    offlineAvailable: true,
    instructions: ['Enter monthly rent and deposit multiple (e.g. 1, 1.5, or 2 months) with pet deposits.'],
    faqs: [{ question: 'What is statutory limit on rental security deposits?', answer: 'Many jurisdictions cap security deposits at 1 to 2 months of standard rent for unfurnished residential leases.' }],
    relatedTools: ['monthly-rent-splitter'],
    component: SecurityDepositCalculator
  },
  // 66. Mortgage/EMI Calculator
  {
    id: 'property-mortgage-calculator',
    name: 'Mortgage/EMI Calculator',
    shortDescription: 'Real estate mortgage calculator computing monthly Principal, Interest, Property Taxes, Insurance, and PMI (PITI).',
    category: 'home',
    iconName: 'Calculator',
    keywords: ['mortgage calculator', 'piti calculator', 'home loan emi', 'amortization schedule'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter home purchase price and down payment.',
      'Input mortgage interest rate and loan term (15 or 30 years).',
      'View complete PITI breakdown and total interest paid.'
    ],
    faqs: [{ question: 'What does PITI stand for?', answer: 'PITI stands for Principal, Interest, Taxes, and Insurance — the four core components of a monthly mortgage payment.' }],
    relatedTools: ['home-loan-affordability-calculator', 'rent-vs-buy-calculator'],
    component: PropertyMortgageCalculator
  },
  // 67. Home Loan Affordability Calculator
  {
    id: 'home-loan-affordability-calculator',
    name: 'Home Loan Affordability Calculator',
    shortDescription: 'Calculate maximum home purchase price based on gross monthly income, debt obligations, down payment, and DTI ratios.',
    category: 'home',
    iconName: 'Scale',
    keywords: ['home affordability', 'how much house can i afford', 'dti ratio', 'max borrowing capacity'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Enter monthly gross household income.',
      'Input recurring monthly debt payments and saved down payment.',
      'View your maximum affordable house purchase price under standard 28/36 DTI rules.'
    ],
    faqs: [{ question: 'What is the 28/36 Debt-to-Income (DTI) rule?', answer: 'A standard mortgage qualification guideline: no more than 28% of gross income should go to housing costs (Front-End), and no more than 36% to total debt payments (Back-End).' }],
    relatedTools: ['property-mortgage-calculator', 'rent-vs-buy-calculator'],
    component: HomeLoanAffordabilityCalculator
  },
  // 68. Property Investment Calculator
  {
    id: 'property-investment-calculator',
    name: 'Property Investment Calculator',
    shortDescription: 'Evaluate rental investments: Net Operating Income (NOI), Capitalization Rate (Cap Rate), Cash-on-Cash Return, and cash flow.',
    category: 'home',
    iconName: 'TrendingUp',
    keywords: ['cap rate', 'cash on cash return', 'real estate investment', 'noi calculator'],
    offlineAvailable: true,
    instructions: [
      'Enter property purchase price and rental income.',
      'Input operating expenses to view Cap Rate and Cash-on-Cash Return on invested capital.'
    ],
    faqs: [{ question: 'What is Capitalization Rate (Cap Rate)?', answer: 'Cap Rate is the ratio of Net Operating Income (NOI) to property purchase price, reflecting unleveraged return on asset value.' }],
    relatedTools: ['rental-yield-calculator', 'property-expense-tracker'],
    component: PropertyInvestmentCalculator
  },
  // 69. Rent vs Buy Calculator
  {
    id: 'rent-vs-buy-calculator',
    name: 'Rent vs Buy Calculator',
    shortDescription: 'Compare long-term cumulative financial wealth of renting and investing vs buying a home over 5 to 30 years.',
    category: 'home',
    iconName: 'Scale',
    keywords: ['rent vs buy', 'is it better to rent or buy', 'home equity vs rent', 'wealth comparison'],
    isPopular: true,
    offlineAvailable: true,
    instructions: [
      'Input monthly rent and target home purchase price.',
      'Specify down payment and comparison timeline.',
      'Review net worth and financial advice factoring appreciation, inflation, and investment returns.'
    ],
    faqs: [{ question: 'When is buying better than renting?', answer: 'Buying typically outperforms renting when you plan to stay in the home for at least 5 to 7 years, allowing appreciation and principal paydown to offset upfront closing costs.' }],
    relatedTools: ['property-mortgage-calculator', 'home-loan-affordability-calculator'],
    component: RentVsBuyCalculator
  },
  // 70. Property Expense Tracker
  {
    id: 'property-expense-tracker',
    name: 'Property Expense Tracker',
    shortDescription: 'Track property operational expenses: mortgage disbursements, property taxes, HOA fees, insurance, and utilities.',
    category: 'home',
    iconName: 'DollarSign',
    keywords: ['property expenses', 'hoa fees log', 'mortgage tracker', 'real estate operating ledger'],
    offlineAvailable: true,
    instructions: [
      'Log property disbursements by category (mortgage, tax, HOA, insurance).',
      'Track total annual holding costs.'
    ],
    faqs: [{ question: 'Where are property expense records saved?', answer: 'Stored locally in IndexedDB on your device (`lifetools_household_db`) with full backup and restore capabilities.' }],
    relatedTools: ['home-repair-expense-tracker', 'rental-yield-calculator'],
    component: PropertyExpenseTracker
  }
];
