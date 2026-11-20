import { lazy } from 'react';
import { ToolItem } from '../types';

// Lazy load Travel Calculator Tools (15 tools)
const TravelDistanceCalculator = lazy(() =>
  import('../components/tools/travel/TravelCalculatorTools').then((m) => ({ default: m.TravelDistanceCalculator }))
);
const TripFuelCostCalculator = lazy(() =>
  import('../components/tools/travel/TravelCalculatorTools').then((m) => ({ default: m.TripFuelCostCalculator }))
);
const VehicleFuelMileageCalculator = lazy(() =>
  import('../components/tools/travel/TravelCalculatorTools').then((m) => ({ default: m.VehicleFuelMileageCalculator }))
);
const TripCostCalculator = lazy(() =>
  import('../components/tools/travel/TravelCalculatorTools').then((m) => ({ default: m.TripCostCalculator }))
);
const TravelBudgetEstimator = lazy(() =>
  import('../components/tools/travel/TravelCalculatorTools').then((m) => ({ default: m.TravelBudgetEstimator }))
);
const RoadTripCostSplitter = lazy(() =>
  import('../components/tools/travel/TravelCalculatorTools').then((m) => ({ default: m.RoadTripCostSplitter }))
);
const TravelTimeEstimator = lazy(() =>
  import('../components/tools/travel/TravelCalculatorTools').then((m) => ({ default: m.TravelTimeEstimator }))
);
const AverageTravelSpeedCalculator = lazy(() =>
  import('../components/tools/travel/TravelCalculatorTools').then((m) => ({ default: m.AverageTravelSpeedCalculator }))
);
const FlightDurationCalculator = lazy(() =>
  import('../components/tools/travel/TravelCalculatorTools').then((m) => ({ default: m.FlightDurationCalculator }))
);
const TravelTimeZoneConverter = lazy(() =>
  import('../components/tools/travel/TravelCalculatorTools').then((m) => ({ default: m.TravelTimeZoneConverter }))
);
const JetLagCalculator = lazy(() =>
  import('../components/tools/travel/TravelCalculatorTools').then((m) => ({ default: m.JetLagCalculator }))
);
const TravelCurrencyConverter = lazy(() =>
  import('../components/tools/travel/TravelCalculatorTools').then((m) => ({ default: m.TravelCurrencyConverter }))
);
const LuggageWeightConverter = lazy(() =>
  import('../components/tools/travel/TravelCalculatorTools').then((m) => ({ default: m.LuggageWeightConverter }))
);
const BaggageAllowanceCalculator = lazy(() =>
  import('../components/tools/travel/TravelCalculatorTools').then((m) => ({ default: m.BaggageAllowanceCalculator }))
);
const TravelExpenseSplitter = lazy(() =>
  import('../components/tools/travel/TravelCalculatorTools').then((m) => ({ default: m.TravelExpenseSplitter }))
);

// Lazy load Trip Planning Tools (10 tools)
const TripPlanner = lazy(() =>
  import('../components/tools/travel/TripPlanningTools').then((m) => ({ default: m.TripPlanner }))
);
const TravelItineraryBuilder = lazy(() =>
  import('../components/tools/travel/TripPlanningTools').then((m) => ({ default: m.TravelItineraryBuilder }))
);
const DailyTravelSchedule = lazy(() =>
  import('../components/tools/travel/TripPlanningTools').then((m) => ({ default: m.DailyTravelSchedule }))
);
const MultiCityTripPlanner = lazy(() =>
  import('../components/tools/travel/TripPlanningTools').then((m) => ({ default: m.MultiCityTripPlanner }))
);
const RoadTripPlanner = lazy(() =>
  import('../components/tools/travel/TripPlanningTools').then((m) => ({ default: m.RoadTripPlanner }))
);
const WeekendTripPlanner = lazy(() =>
  import('../components/tools/travel/TripPlanningTools').then((m) => ({ default: m.WeekendTripPlanner }))
);
const HolidayPlanner = lazy(() =>
  import('../components/tools/travel/TripPlanningTools').then((m) => ({ default: m.HolidayPlanner }))
);
const TravelBudgetPlanner = lazy(() =>
  import('../components/tools/travel/TripPlanningTools').then((m) => ({ default: m.TravelBudgetPlanner }))
);
const GroupTripOrganizer = lazy(() =>
  import('../components/tools/travel/TripPlanningTools').then((m) => ({ default: m.GroupTripOrganizer }))
);
const TravelChecklistGenerator = lazy(() =>
  import('../components/tools/travel/TripPlanningTools').then((m) => ({ default: m.TravelChecklistGenerator }))
);

// Lazy load Packing & Preparation Tools (10 tools)
const SmartPackingList = lazy(() =>
  import('../components/tools/travel/PackingPreparationTools').then((m) => ({ default: m.SmartPackingList }))
);
const InternationalTravelChecklist = lazy(() =>
  import('../components/tools/travel/PackingPreparationTools').then((m) => ({ default: m.InternationalTravelChecklist }))
);
const BusinessTripPackingList = lazy(() =>
  import('../components/tools/travel/PackingPreparationTools').then((m) => ({ default: m.BusinessTripPackingList }))
);
const CampingChecklist = lazy(() =>
  import('../components/tools/travel/PackingPreparationTools').then((m) => ({ default: m.CampingChecklist }))
);
const BeachTripChecklist = lazy(() =>
  import('../components/tools/travel/PackingPreparationTools').then((m) => ({ default: m.BeachTripChecklist }))
);
const WinterTravelChecklist = lazy(() =>
  import('../components/tools/travel/PackingPreparationTools').then((m) => ({ default: m.WinterTravelChecklist }))
);
const TravelDocumentChecklist = lazy(() =>
  import('../components/tools/travel/PackingPreparationTools').then((m) => ({ default: m.TravelDocumentChecklist }))
);
const LuggageOrganizer = lazy(() =>
  import('../components/tools/travel/PackingPreparationTools').then((m) => ({ default: m.LuggageOrganizer }))
);
const BaggageWeightTracker = lazy(() =>
  import('../components/tools/travel/PackingPreparationTools').then((m) => ({ default: m.BaggageWeightTracker }))
);
const PreDepartureChecklist = lazy(() =>
  import('../components/tools/travel/PackingPreparationTools').then((m) => ({ default: m.PreDepartureChecklist }))
);

// Lazy load Navigation & Location Tools (10 tools)
const GpsCoordinatesFormatter = lazy(() =>
  import('../components/tools/travel/NavigationLocationTools').then((m) => ({ default: m.GpsCoordinatesFormatter }))
);
const LatitudeLongitudeConverter = lazy(() =>
  import('../components/tools/travel/NavigationLocationTools').then((m) => ({ default: m.LatitudeLongitudeConverter }))
);
const DecimalDegreesToDmsConverter = lazy(() =>
  import('../components/tools/travel/NavigationLocationTools').then((m) => ({ default: m.DecimalDegreesToDmsConverter }))
);
const DmsToDecimalDegreesConverter = lazy(() =>
  import('../components/tools/travel/NavigationLocationTools').then((m) => ({ default: m.DmsToDecimalDegreesConverter }))
);
const CoordinateDistanceCalculator = lazy(() =>
  import('../components/tools/travel/NavigationLocationTools').then((m) => ({ default: m.CoordinateDistanceCalculator }))
);
const BearingCalculator = lazy(() =>
  import('../components/tools/travel/NavigationLocationTools').then((m) => ({ default: m.BearingCalculator }))
);
const CompassDirectionCalculator = lazy(() =>
  import('../components/tools/travel/NavigationLocationTools').then((m) => ({ default: m.CompassDirectionCalculator }))
);
const MapLinkGenerator = lazy(() =>
  import('../components/tools/travel/NavigationLocationTools').then((m) => ({ default: m.MapLinkGenerator }))
);
const GoogleMapsRouteBuilder = lazy(() =>
  import('../components/tools/travel/NavigationLocationTools').then((m) => ({ default: m.GoogleMapsRouteBuilder }))
);
const TravelLocationQrGenerator = lazy(() =>
  import('../components/tools/travel/NavigationLocationTools').then((m) => ({ default: m.TravelLocationQrGenerator }))
);

// Lazy load Travel Documents & Records Tools (10 tools)
const TravelDocumentOrganizer = lazy(() =>
  import('../components/tools/travel/TravelDocumentRecordTools').then((m) => ({ default: m.TravelDocumentOrganizer }))
);
const PassportExpiryReminder = lazy(() =>
  import('../components/tools/travel/TravelDocumentRecordTools').then((m) => ({ default: m.PassportExpiryReminder }))
);
const VisaExpiryReminder = lazy(() =>
  import('../components/tools/travel/TravelDocumentRecordTools').then((m) => ({ default: m.VisaExpiryReminder }))
);
const TravelInsuranceChecklist = lazy(() =>
  import('../components/tools/travel/TravelDocumentRecordTools').then((m) => ({ default: m.TravelInsuranceChecklist }))
);
const EmergencyTravelCard = lazy(() =>
  import('../components/tools/travel/TravelDocumentRecordTools').then((m) => ({ default: m.EmergencyTravelCard }))
);
const HotelBookingOrganizer = lazy(() =>
  import('../components/tools/travel/TravelDocumentRecordTools').then((m) => ({ default: m.HotelBookingOrganizer }))
);
const FlightInformationOrganizer = lazy(() =>
  import('../components/tools/travel/TravelDocumentRecordTools').then((m) => ({ default: m.FlightInformationOrganizer }))
);
const TravelExpenseLog = lazy(() =>
  import('../components/tools/travel/TravelDocumentRecordTools').then((m) => ({ default: m.TravelExpenseLog }))
);
const TravelJournal = lazy(() =>
  import('../components/tools/travel/TravelDocumentRecordTools').then((m) => ({ default: m.TravelJournal }))
);
const TripSummaryGenerator = lazy(() =>
  import('../components/tools/travel/TravelDocumentRecordTools').then((m) => ({ default: m.TripSummaryGenerator }))
);

export const TRAVEL_TOOLS_REGISTRY: ToolItem[] = [
  // ==========================================
  // SECTION 1: TRAVEL CALCULATORS (15 tools)
  // ==========================================
  {
    id: 'travel-distance-calculator',
    name: 'Travel Distance Calculator',
    shortDescription: 'Convert and calculate distances between metric and imperial units (km, miles, meters, nautical miles).',
    category: 'travel',
    iconName: 'Milestone',
    keywords: ['distance', 'kilometers to miles', 'nautical miles', 'travel distance'],
    isPopular: true,
    instructions: ['Enter distance value and select source unit.', 'Instantly view conversions across km, miles, meters, and nautical miles.'],
    faqs: [{ question: 'What is a nautical mile?', answer: 'A nautical mile is based on the Earth’s circumference (1 NM = 1.852 km or ~1.151 miles), used in aviation and marine navigation.' }],
    relatedTools: ['trip-fuel-cost-calculator', 'coordinate-distance-calculator'],
    component: TravelDistanceCalculator
  },
  {
    id: 'trip-fuel-cost-calculator',
    name: 'Trip Fuel Cost Calculator',
    shortDescription: 'Calculate vehicle fuel consumption, total cost, and roundtrip petrol/diesel budget for road journeys.',
    category: 'travel',
    iconName: 'Car',
    keywords: ['fuel cost', 'gas calculator', 'petrol cost', 'trip fuel', 'diesel budget'],
    isPopular: true,
    instructions: ['Enter trip distance, vehicle fuel efficiency, and fuel price per unit.', 'View fuel volume required, total cost, and roundtrip cost.'],
    faqs: [{ question: 'How is trip fuel cost determined?', answer: 'Fuel needed = Distance / Fuel Economy. Total cost = Fuel needed × Price per unit.' }],
    relatedTools: ['vehicle-fuel-mileage-calculator', 'road-trip-cost-splitter'],
    component: TripFuelCostCalculator
  },
  {
    id: 'vehicle-fuel-mileage-calculator',
    name: 'Fuel Mileage Converter',
    shortDescription: 'Bidirectionally convert vehicle fuel economy between MPG (US), MPG (Imperial), L/100km, and km/L.',
    category: 'travel',
    iconName: 'Gauge',
    keywords: ['fuel mileage', 'mpg to l 100km', 'km per liter', 'fuel consumption'],
    instructions: ['Enter your vehicle’s mileage value.', 'Select your current unit to convert across US MPG, UK MPG, L/100km, and km/L.'],
    faqs: [{ question: 'Why is UK MPG different from US MPG?', answer: 'An Imperial gallon (UK) is ~4.546 liters, while a US gallon is ~3.785 liters, making UK MPG numbers ~20% higher for the same efficiency.' }],
    relatedTools: ['trip-fuel-cost-calculator', 'road-trip-planner'],
    component: VehicleFuelMileageCalculator
  },
  {
    id: 'trip-cost-calculator',
    name: 'Trip Cost Calculator',
    shortDescription: 'Aggregate transportation, lodging, food, activities, and emergency buffers for total trip expenditure.',
    category: 'travel',
    iconName: 'DollarSign',
    keywords: ['trip cost', 'travel budget', 'vacation estimate', 'holiday spending'],
    isPopular: true,
    instructions: ['Input estimates for transport, lodging, meals, activities, and contingency.', 'Calculate total cost and daily average cost per person.'],
    faqs: [{ question: 'How much contingency buffer should I plan?', answer: 'Travel experts recommend reserving 10% to 15% of your total budget for unforeseen delays, emergency transit, or changes.' }],
    relatedTools: ['travel-budget-estimator', 'travel-expense-splitter'],
    component: TripCostCalculator
  },
  {
    id: 'travel-budget-estimator',
    name: 'Travel Budget Tier Estimator',
    shortDescription: 'Compare Budget Backpacker, Mid-Range Comfort, and Luxury travel styles with personalized daily benchmarks.',
    category: 'travel',
    iconName: 'DollarSign',
    keywords: ['travel budget estimator', 'backpacker budget', 'luxury travel cost', 'vacation spending tier'],
    instructions: ['Enter trip days and traveler count.', 'Compare budget totals across Backpacker, Mid-Range, and Luxury travel tiers.'],
    faqs: [{ question: 'What defines a Mid-Range budget?', answer: 'Mid-range typically covers private 3-4 star hotels, sit-down local restaurants, taxis/metro, and guided museum entry.' }],
    relatedTools: ['trip-cost-calculator', 'travel-budget-planner'],
    component: TravelBudgetEstimator
  },
  {
    id: 'road-trip-cost-splitter',
    name: 'Road Trip Cost Splitter',
    shortDescription: 'Calculate fair cost distribution for gas, highway tolls, vehicle wear, and parking among passengers.',
    category: 'travel',
    iconName: 'Users',
    keywords: ['split gas', 'carpool cost', 'road trip expenses', 'passenger split'],
    isPopular: true,
    instructions: ['Enter fuel cost, tolls, parking, and number of passengers.', 'Optionally exempt the vehicle driver from paying fuel fees.'],
    faqs: [{ question: 'Should the car owner/driver pay for gas?', answer: 'Many groups exempt the car owner from gas to account for vehicle maintenance, insurance wear, and driving effort.' }],
    relatedTools: ['trip-fuel-cost-calculator', 'travel-expense-splitter'],
    component: RoadTripCostSplitter
  },
  {
    id: 'travel-time-estimator',
    name: 'Travel Time & Arrival Estimator',
    shortDescription: 'Estimate total travel duration and exact arrival time by factoring in rest stops and traffic delays.',
    category: 'travel',
    iconName: 'Clock',
    keywords: ['travel time', 'arrival estimator', 'driving time', 'rest stop delay'],
    instructions: ['Enter distance, driving speed, departure time, and planned rest stop duration.', 'View estimated arrival time and elapsed travel hours.'],
    faqs: [{ question: 'How often should drivers take breaks?', answer: 'Road safety authorities recommend a minimum 15-minute break every 2 hours of continuous driving to prevent fatigue.' }],
    relatedTools: ['average-travel-speed-calculator', 'flight-duration-calculator'],
    component: TravelTimeEstimator
  },
  {
    id: 'average-travel-speed-calculator',
    name: 'Average Travel Speed Calculator',
    shortDescription: 'Calculate moving speed and overall journey pace across kilometers per hour and miles per hour.',
    category: 'travel',
    iconName: 'Navigation',
    keywords: ['average speed', 'travel speed', 'kmh to mph', 'pace calculator'],
    instructions: ['Input distance and elapsed hours/minutes.', 'Instantly view your average speed in km/h, mph, and minutes per km/mile.'],
    faqs: [{ question: 'What is the difference between moving speed and average journey speed?', answer: 'Average journey speed includes rest stops, meals, and border crossings, whereas moving speed measures vehicle motion only.' }],
    relatedTools: ['travel-time-estimator', 'coordinate-distance-calculator'],
    component: AverageTravelSpeedCalculator
  },
  {
    id: 'flight-duration-calculator',
    name: 'Flight Duration & Airport Buffer Calculator',
    shortDescription: 'Compute airborne flight time, airport security buffers, and total door-to-door transit time.',
    category: 'travel',
    iconName: 'Plane',
    keywords: ['flight duration', 'flight time', 'airport buffer', 'door to door travel'],
    isPopular: true,
    instructions: ['Enter scheduled flight duration and airport transit times.', 'Select domestic or international to calculate recommended airport arrival time.'],
    faqs: [{ question: 'How early should I arrive at the airport?', answer: 'General airline guidance is 2 hours before departure for domestic flights and 3 hours before departure for international flights.' }],
    relatedTools: ['travel-time-zone-converter', 'jet-lag-calculator'],
    component: FlightDurationCalculator
  },
  {
    id: 'travel-time-zone-converter',
    name: 'Travel Time Zone Difference Calculator',
    shortDescription: 'Calculate time differences and local arrival times across major international time zones.',
    category: 'travel',
    iconName: 'Globe',
    keywords: ['time zone converter', 'utc offset', 'jet lag time', 'local time difference'],
    instructions: ['Select origin and destination time zones.', 'View net hour difference and calculate destination time from origin departure.'],
    faqs: [{ question: 'What is UTC offset?', answer: 'UTC (Coordinated Universal Time) is the global time standard from which local time zones add or subtract hours.' }],
    relatedTools: ['flight-duration-calculator', 'jet-lag-calculator'],
    component: TravelTimeZoneConverter
  },
  {
    id: 'jet-lag-calculator',
    name: 'Jet Lag Recovery Calculator',
    shortDescription: 'Estimate physiological jet lag adjustment days and sleep sync schedules for eastward or westward flights.',
    category: 'travel',
    iconName: 'Sunrise',
    keywords: ['jet lag', 'circadian rhythm', 'sleep adjustment', 'time zone adaptation'],
    instructions: ['Enter time zones crossed and direction of travel (Eastward or Westward).', 'Get estimated recovery days and circadian realignment tips.'],
    faqs: [{ question: 'Why is jet lag worse flying east?', answer: 'Flying eastward shortens the day, forcing your body’s internal circadian clock to advance, which is harder than extending the day flying west.' }],
    relatedTools: ['travel-time-zone-converter', 'flight-duration-calculator'],
    component: JetLagCalculator
  },
  {
    id: 'travel-currency-converter',
    name: 'Travel Currency Benchmark Converter',
    shortDescription: 'Convert travel funds with offline reference exchange rates, manual rate overrides, and foreign ATM fee estimation.',
    category: 'travel',
    iconName: 'DollarSign',
    keywords: ['currency converter', 'exchange rate', 'foreign transaction fee', 'travel money'],
    isPopular: true,
    instructions: ['Select base and target currency.', 'Optionally adjust the rate to match your actual bank or card exchange rate.'],
    faqs: [{ question: 'Are these exchange rates live?', answer: 'Rates are offline reference benchmarks that work anywhere without internet. You can manually adjust the rate to match your exact card fee or local kiosk.' }],
    relatedTools: ['trip-cost-calculator', 'travel-budget-planner'],
    component: TravelCurrencyConverter
  },
  {
    id: 'luggage-weight-converter',
    name: 'Luggage Weight Converter',
    shortDescription: 'Convert baggage weights between kilograms, pounds, and ounces with standard airline threshold checks.',
    category: 'travel',
    iconName: 'Luggage',
    keywords: ['luggage weight', 'kg to lbs', 'baggage scale', 'suitcase weight'],
    instructions: ['Enter weight value and select source unit.', 'Check against standard airline limits: 7kg / 15lbs (carry-on), 23kg / 50lbs (checked), 32kg / 70lbs (heavy).'],
    faqs: [{ question: 'What is the standard airline checked luggage weight limit?', answer: 'Most commercial airlines permit up to 23 kg (50.7 lbs) for economy checked bags without excess baggage surcharges.' }],
    relatedTools: ['baggage-allowance-calculator', 'baggage-weight-tracker'],
    component: LuggageWeightConverter
  },
  {
    id: 'baggage-allowance-calculator',
    name: 'Baggage Allowance Policy Checker',
    shortDescription: 'Look up standard carry-on and checked luggage limits across major global airline alliances.',
    category: 'travel',
    iconName: 'Scale',
    keywords: ['baggage allowance', 'carry on limit', 'checked bag dimensions', 'airline baggage policy'],
    instructions: ['Select airline carrier category.', 'Inspect dimension limits (L + W + H) and maximum allowable weight for carry-on and checked bags.'],
    faqs: [{ question: 'What is the standard carry-on size restriction?', answer: 'Most global airlines adhere to 56 × 36 × 23 cm (22 × 14 × 9 inches) including wheels and handles.' }],
    relatedTools: ['luggage-weight-converter', 'baggage-weight-tracker'],
    component: BaggageAllowanceCalculator
  },
  {
    id: 'travel-expense-splitter',
    name: 'Group Travel Expense Splitter',
    shortDescription: 'Split group vacation expenses and minimize cross-person debt transfers with fair settlement calculations.',
    category: 'travel',
    iconName: 'Users',
    keywords: ['split expenses', 'group trip bill', 'settle debts', 'travel expense split'],
    isPopular: true,
    instructions: ['Enter traveler names and total group expenditure.', 'View equal per-person shares and cost breakdown.'],
    faqs: [{ question: 'How does equal expense splitting work?', answer: 'Total trip cost is divided equally among all group members, and differences paid by individuals are reconciled into minimum transfer payments.' }],
    relatedTools: ['road-trip-cost-splitter', 'travel-expense-log'],
    component: TravelExpenseSplitter
  },

  // ==========================================
  // SECTION 2: TRIP PLANNING TOOLS (10 tools)
  // ==========================================
  {
    id: 'trip-planner',
    name: 'Trip Planner & Trip Manager',
    shortDescription: 'Create, schedule, and organize multi-day travel plans with offline local database persistence.',
    category: 'travel',
    iconName: 'Calendar',
    keywords: ['trip planner', 'vacation planner', 'travel organizer', 'trip manager'],
    isPopular: true,
    instructions: ['Click New Trip to set destination, start/end dates, budget, and traveler count.', 'Track trip status from Planning to Upcoming and Completed.'],
    faqs: [{ question: 'Where is my trip data stored?', answer: 'All trips are stored 100% locally in your browser’s IndexedDB database. Nothing is sent to external servers.' }],
    relatedTools: ['travel-itinerary-builder', 'daily-travel-schedule', 'travel-budget-planner'],
    component: TripPlanner
  },
  {
    id: 'travel-itinerary-builder',
    name: 'Travel Itinerary Builder',
    shortDescription: 'Build structured day-by-day itineraries with activity times, locations, sightseeing, and costs.',
    category: 'travel',
    iconName: 'Route',
    keywords: ['itinerary builder', 'travel schedule', 'day plan', 'activity schedule'],
    isPopular: true,
    instructions: ['Select Day 1, 2, 3... and add activities with time, location, category, and cost.', 'Mark activities complete as you travel, or copy the day schedule to clipboard.'],
    faqs: [{ question: 'Can I export my itinerary?', answer: 'Yes! Click "Copy Day Schedule" to copy your entire formatted agenda for sharing via messaging or offline notes.' }],
    relatedTools: ['trip-planner', 'daily-travel-schedule', 'multi-city-trip-planner'],
    component: TravelItineraryBuilder
  },
  {
    id: 'daily-travel-schedule',
    name: 'Daily Travel Schedule',
    shortDescription: 'Hour-by-hour structured daily schedule with transit buffer recommendations to prevent missed reservations.',
    category: 'travel',
    iconName: 'Clock',
    keywords: ['daily travel schedule', 'hour by hour plan', 'travel timetable', 'buffer planner'],
    instructions: ['Add scheduled time slots throughout your travel day.', 'Review recommended buffer times between activities.'],
    faqs: [{ question: 'Why are transit buffers important?', answer: 'Transit delays, metro queues, and ticket security checks frequently require 15-30 minute buffers between activities.' }],
    relatedTools: ['travel-itinerary-builder', 'trip-planner'],
    component: DailyTravelSchedule
  },
  {
    id: 'multi-city-trip-planner',
    name: 'Multi-City Trip Planner',
    shortDescription: 'Chain multi-leg routing across cities with flights, trains, layovers, and stay durations.',
    category: 'travel',
    iconName: 'Plane',
    keywords: ['multi city planner', 'multi leg flight', 'euro trip planner', 'connecting cities'],
    isPopular: true,
    instructions: ['Add city legs with departure/arrival dates, transport mode, stay days, and costs.', 'Track total transit budget and total vacation duration across all destinations.'],
    faqs: [{ question: 'What transport modes are supported?', answer: 'Flights, trains, buses, rental cars, and ferries are supported for multi-city connectivity.' }],
    relatedTools: ['road-trip-planner', 'travel-itinerary-builder'],
    component: MultiCityTripPlanner
  },
  {
    id: 'road-trip-planner',
    name: 'Road Trip Planner',
    shortDescription: 'Plan driving waypoints, scenic stops, driver rotations, and rest break intervals along highway routes.',
    category: 'travel',
    iconName: 'Car',
    keywords: ['road trip planner', 'driving itinerary', 'scenic stops', 'driver rotation'],
    isPopular: true,
    instructions: ['Add road trip stops, driving hours, distance, and designated driver.', 'Review automatically calculated recommended rest breaks.'],
    faqs: [{ question: 'How are rest stops calculated?', answer: 'The tool recommends at least one 15-minute rest break for every 2 hours of accumulated driving.' }],
    relatedTools: ['trip-fuel-cost-calculator', 'road-trip-cost-splitter'],
    component: RoadTripPlanner
  },
  {
    id: 'weekend-trip-planner',
    name: 'Weekend Trip Planner',
    shortDescription: 'Curated 48-hour getaway template from Friday evening arrival to Sunday evening return.',
    category: 'travel',
    iconName: 'Calendar',
    keywords: ['weekend trip', '48 hour getaway', 'mini vacation', 'weekend planner'],
    instructions: ['Set your destination and customize the 6-period weekend itinerary.', 'Export or copy your 48-hour schedule in one click.'],
    faqs: [{ question: 'What is the optimal weekend trip radius?', answer: 'Most weekend travelers target destinations within a 2-3 hour flight or 3-4 hour drive to maximize destination time.' }],
    relatedTools: ['trip-planner', 'holiday-planner'],
    component: WeekendTripPlanner
  },
  {
    id: 'holiday-planner',
    name: 'Holiday & Vacation Maximizer',
    shortDescription: 'Optimize leave days by bridging public holidays and surrounding weekends to maximize consecutive days off.',
    category: 'travel',
    iconName: 'Sun',
    keywords: ['holiday planner', 'vacation maximizer', 'annual leave bridge', 'days off calculator'],
    instructions: ['Enter annual leave days taken and adjacent public holidays.', 'See total consecutive vacation days unlocked by bridging weekends.'],
    faqs: [{ question: 'How does weekend bridging work?', answer: 'Taking 4 official leave days around a public holiday that touches a weekend yields up to 9 consecutive days away from work.' }],
    relatedTools: ['weekend-trip-planner', 'trip-planner'],
    component: HolidayPlanner
  },
  {
    id: 'travel-budget-planner',
    name: 'Travel Budget Category Planner',
    shortDescription: 'Allocate travel funds across flights, lodging, food, activities, and track planned vs actual expenses.',
    category: 'travel',
    iconName: 'DollarSign',
    keywords: ['travel budget planner', 'vacation budget categories', 'spending tracker', 'trip expenses'],
    instructions: ['Set planned amounts for core travel categories.', 'Update spent amounts as your trip progresses to visualize remaining buffer.'],
    faqs: [{ question: 'Which category typically represents the largest travel cost?', answer: 'Accommodation and flights typically constitute 50% to 65% of total travel expenditures.' }],
    relatedTools: ['trip-cost-calculator', 'travel-expense-log'],
    component: TravelBudgetPlanner
  },
  {
    id: 'group-trip-organizer',
    name: 'Group Trip Organizer',
    shortDescription: 'Coordinate group traveler roles, designate leads (driver, treasurer, coordinator), and emergency contacts.',
    category: 'travel',
    iconName: 'Users',
    keywords: ['group trip organizer', 'travel roles', 'group vacation', 'trip coordinator'],
    instructions: ['Add group members and assign responsibilities such as Trip Coordinator, Lead Navigator, or Treasurer.', 'Store emergency phone numbers and contact emails.'],
    faqs: [{ question: 'Why assign group roles?', answer: 'Assigning designated leads prevents miscommunication regarding car rentals, booking confirmations, and group bill settlements.' }],
    relatedTools: ['travel-expense-splitter', 'trip-planner'],
    component: GroupTripOrganizer
  },
  {
    id: 'travel-checklist-generator',
    name: 'Travel Checklist Generator',
    shortDescription: 'Generate dynamic pre-trip preparation checklists organized into deadlines from 2 weeks prior to departure morning.',
    category: 'travel',
    iconName: 'CheckSquare',
    keywords: ['travel checklist generator', 'pre trip checklist', 'vacation tasks', 'travel preparation'],
    isPopular: true,
    instructions: ['Select domestic vs international and toggle family/kids requirements.', 'Check off items as completed or copy the full checklist.'],
    faqs: [{ question: 'When should international travel preparations begin?', answer: 'Critical tasks (passport validity, visas, vaccinations) should be addressed at least 2 to 4 weeks prior to departure.' }],
    relatedTools: ['smart-packing-list', 'pre-departure-checklist'],
    component: TravelChecklistGenerator
  },

  // ==========================================
  // SECTION 3: PACKING & PREPARATION TOOLS (10 tools)
  // ==========================================
  {
    id: 'smart-packing-list',
    name: 'Smart Packing List & Luggage Tracker',
    shortDescription: 'Organize and track packed belongings categorized by luggage bag (Carry-On, Checked Bag, Personal Item).',
    category: 'travel',
    iconName: 'Luggage',
    keywords: ['smart packing list', 'luggage checklist', 'packing tracker', 'carry on items'],
    isPopular: true,
    instructions: ['Add items with category and target bag type.', 'Check off items as packed to monitor your overall packing progress.'],
    faqs: [{ question: 'Where is my packing list saved?', answer: 'All items are stored locally in your browser’s database and persist across browser sessions.' }],
    relatedTools: ['luggage-organizer', 'baggage-weight-tracker', 'travel-checklist-generator'],
    component: SmartPackingList
  },
  {
    id: 'international-travel-checklist',
    name: 'International Travel Checklist',
    shortDescription: 'Verify 6-month passport validity, electronic visas, roaming eSIM profiles, and foreign currency cards.',
    category: 'travel',
    iconName: 'Globe',
    keywords: ['international travel checklist', 'passport check', 'visa checklist', 'cross border travel'],
    isPopular: true,
    instructions: ['Review critical international travel items.', 'Check off each verification before heading to the airport.'],
    faqs: [{ question: 'What is the 6-month passport rule?', answer: 'Many countries require passports to remain valid for at least 6 months past your scheduled date of departure.' }],
    relatedTools: ['passport-expiry-reminder', 'travel-document-checklist'],
    component: InternationalTravelChecklist
  },
  {
    id: 'business-trip-packing-list',
    name: 'Business Trip Packing List',
    shortDescription: 'Tailored checklist for executive travel: business cards, laptop dongles, garment steamers, and corporate cards.',
    category: 'travel',
    iconName: 'Briefcase',
    keywords: ['business trip packing', 'corporate travel', 'executive checklist', 'conference packing'],
    instructions: ['Review professional attire, presentation dongles, and business travel essentials.', 'Check off items as you pack your briefcase and carry-on.'],
    faqs: [{ question: 'What tech accessories are essential for business travel?', answer: 'A multi-port USB-C to HDMI adapter, high-capacity power bank, and universal power adapter are vital.' }],
    relatedTools: ['smart-packing-list', 'international-travel-checklist'],
    component: BusinessTripPackingList
  },
  {
    id: 'camping-checklist',
    name: 'Camping & Backcountry Checklist',
    shortDescription: 'Field-tested gear list for camping, hiking, and outdoor survival: shelter, water filtration, cooking, and first aid.',
    category: 'travel',
    iconName: 'Tent',
    keywords: ['camping checklist', 'outdoor gear', 'hiking packing list', 'survival gear'],
    instructions: ['Check off tent, sleeping bag, water purification, and camp kitchen items before venturing outdoors.'],
    faqs: [{ question: 'What are the 10 essentials for backcountry hiking?', answer: 'Navigation, headlamp, sun protection, first aid, knife/repair kit, fire starter, shelter, extra food, extra water, and extra clothes.' }],
    relatedTools: ['smart-packing-list', 'pre-departure-checklist'],
    component: CampingChecklist
  },
  {
    id: 'beach-trip-checklist',
    name: 'Beach Trip Checklist',
    shortDescription: 'Sun protection, watersports essentials, rash guards, dry bags, and sand-free beach day gear.',
    category: 'travel',
    iconName: 'Umbrella',
    keywords: ['beach trip checklist', 'summer packing', 'beach gear', 'sunscreen checklist'],
    instructions: ['Verify UV sunglasses, reef-safe sunscreen, dry bags, and towels for your beach holiday.'],
    faqs: [{ question: 'Why choose reef-safe sunscreen?', answer: 'Reef-safe sunscreens avoid oxybenzone and octinoxate, chemicals known to cause coral bleaching and marine damage.' }],
    relatedTools: ['smart-packing-list', 'weekend-trip-planner'],
    component: BeachTripChecklist
  },
  {
    id: 'winter-travel-checklist',
    name: 'Winter Travel & Snow Checklist',
    shortDescription: 'Sub-zero thermal layering system, insulated waterproof boots, hand warmers, and winter weather gear.',
    category: 'travel',
    iconName: 'Snowflake',
    keywords: ['winter travel checklist', 'snow packing', 'cold weather clothes', 'thermal layers'],
    instructions: ['Review thermal base layers, waterproof outer shells, touch-screen gloves, and boot traction.'],
    faqs: [{ question: 'What is the three-layer winter clothing system?', answer: '1) Base layer (wicks moisture), 2) Middle layer (insulates warmth like fleece/down), 3) Outer shell (blocks wind and water).' }],
    relatedTools: ['smart-packing-list', 'camping-checklist'],
    component: WinterTravelChecklist
  },
  {
    id: 'travel-document-checklist',
    name: 'Travel Document Checklist',
    shortDescription: 'Ensure physical and digital duplicate copies of passports, driver licenses, vouchers, and insurance policies.',
    category: 'travel',
    iconName: 'FileText',
    keywords: ['travel document checklist', 'passport copies', 'boarding pass check', 'hotel voucher check'],
    instructions: ['Verify that all required physical documents and offline digital backup scans are ready.'],
    faqs: [{ question: 'Should I carry photocopies of my passport?', answer: 'Yes. Carrying a physical paper photocopy separate from your actual passport greatly accelerates replacement if lost or stolen.' }],
    relatedTools: ['travel-document-organizer', 'international-travel-checklist'],
    component: TravelDocumentChecklist
  },
  {
    id: 'luggage-organizer',
    name: 'Luggage Compartment & Cube Organizer',
    shortDescription: 'Assign packing cubes and compartments so you never have to unpack your entire suitcase during transit.',
    category: 'travel',
    iconName: 'Luggage',
    keywords: ['luggage organizer', 'packing cubes', 'suitcase compartments', 'travel organization'],
    instructions: ['Assign specific garments and electronics to numbered packing cubes and pouches.'],
    faqs: [{ question: 'What are the benefits of packing cubes?', answer: 'Packing cubes compress clothing, prevent wrinkles, and allow you to access items without rummaging through your whole bag.' }],
    relatedTools: ['smart-packing-list', 'baggage-weight-tracker'],
    component: LuggageOrganizer
  },
  {
    id: 'baggage-weight-tracker',
    name: 'Baggage Weight Tracker',
    shortDescription: 'Tally individual item weights against airline luggage limits to avoid expensive airport counter fees.',
    category: 'travel',
    iconName: 'Scale',
    keywords: ['baggage weight tracker', 'luggage scale', 'suitcase weight tally', 'overweight baggage warning'],
    isPopular: true,
    instructions: ['Enter items and their approximate weight in kg.', 'Monitor your total suitcase weight against the airline limit.'],
    faqs: [{ question: 'How much do airlines charge for overweight luggage?', answer: 'Excess baggage charges typically range from $50 to $200 per overweight bag at the airport check-in counter.' }],
    relatedTools: ['luggage-weight-converter', 'baggage-allowance-calculator'],
    component: BaggageWeightTracker
  },
  {
    id: 'pre-departure-checklist',
    name: 'Pre-Departure Home Security Checklist',
    shortDescription: 'Household safety check before heading to the airport: water shutoff, thermostat, appliances, and door locks.',
    category: 'travel',
    iconName: 'Shield',
    keywords: ['pre departure checklist', 'home security vacation', 'water shutoff', 'house lock checklist'],
    instructions: ['Walk through your home checking off plumbing shutoffs, window locks, appliance unplugs, and trash removal.'],
    faqs: [{ question: 'Why should I shut off the main water valve before traveling?', answer: 'Shutting off the main water supply prevents catastrophic pipe bursts and minor leaks while you are away.' }],
    relatedTools: ['travel-checklist-generator', 'smart-packing-list'],
    component: PreDepartureChecklist
  },

  // ==========================================
  // SECTION 4: NAVIGATION & LOCATION TOOLS (10 tools)
  // ==========================================
  {
    id: 'gps-coordinates-formatter',
    name: 'GPS Coordinates Formatter',
    shortDescription: 'Format geographic latitude and longitude into Decimal Degrees (DD), DMS, DDM, and RFC 5870 GeoURI.',
    category: 'travel',
    iconName: 'LocateFixed',
    keywords: ['gps coordinates formatter', 'lat lng format', 'degrees minutes seconds', 'geouri'],
    isPopular: true,
    instructions: ['Enter latitude and longitude.', 'Copy formatted coordinates in DD, DMS, marine DDM, or native GeoURI.'],
    faqs: [{ question: 'What is a Geo URI?', answer: 'RFC 5870 defines "geo:lat,lng" as the universal uniform resource identifier that prompts mobile operating systems to open native map apps.' }],
    relatedTools: ['latitude-longitude-converter', 'coordinate-distance-calculator'],
    component: GpsCoordinatesFormatter
  },
  {
    id: 'latitude-longitude-converter',
    name: 'Latitude & Longitude Converter',
    shortDescription: 'Bidirectionally convert signed decimal coordinates and directional hemisphere notation (N/S/E/W).',
    category: 'travel',
    iconName: 'Globe',
    keywords: ['lat long converter', 'signed coordinates', 'hemisphere conversion', 'gps converter'],
    instructions: ['Select latitude or longitude and input decimal degrees.', 'View directional hemisphere notation with validated roundtrip precision.'],
    faqs: [{ question: 'How do signs relate to cardinal hemispheres?', answer: 'Positive latitude is North, negative is South. Positive longitude is East, negative is West.' }],
    relatedTools: ['decimal-degrees-to-dms-converter', 'gps-coordinates-formatter'],
    component: LatitudeLongitudeConverter
  },
  {
    id: 'decimal-degrees-to-dms-converter',
    name: 'Decimal Degrees to DMS Converter',
    shortDescription: 'Transform continuous decimal angle coordinates into Degrees (°), Minutes (\'), and Seconds (").',
    category: 'travel',
    iconName: 'Navigation',
    keywords: ['decimal degrees to dms', 'dd to dms', 'coordinates converter', 'degrees minutes seconds'],
    instructions: ['Enter decimal degree coordinate.', 'View calculated Degrees, Minutes, and Seconds breakdown with mathematical formula.'],
    faqs: [{ question: 'What is the formula for DD to DMS?', answer: 'Degrees = integer part; Minutes = integer part of (fraction × 60); Seconds = remaining fraction × 60.' }],
    relatedTools: ['dms-to-decimal-degrees-converter', 'latitude-longitude-converter'],
    component: DecimalDegreesToDmsConverter
  },
  {
    id: 'dms-to-decimal-degrees-converter',
    name: 'DMS to Decimal Degrees Converter',
    shortDescription: 'Compute floating-point decimal coordinates from navigational Degrees, Minutes, and Seconds.',
    category: 'travel',
    iconName: 'Navigation',
    keywords: ['dms to decimal degrees', 'dms to dd', 'navigational coordinates', 'marine coordinates'],
    instructions: ['Input Degrees, Minutes, Seconds, and Cardinal direction (N, S, E, W).', 'Get precise decimal degrees coordinate.'],
    faqs: [{ question: 'What is the formula for DMS to DD?', answer: 'DD = Degrees + (Minutes / 60) + (Seconds / 3600), multiplied by -1 for South and West.' }],
    relatedTools: ['decimal-degrees-to-dms-converter', 'gps-coordinates-formatter'],
    component: DmsToDecimalDegreesConverter
  },
  {
    id: 'coordinate-distance-calculator',
    name: 'Coordinate Distance Calculator (Haversine)',
    shortDescription: 'Calculate great-circle spherical distance across Earth’s curvature in kilometers, miles, and nautical miles.',
    category: 'travel',
    iconName: 'Route',
    keywords: ['coordinate distance', 'haversine distance', 'distance between coordinates', 'great circle distance'],
    isPopular: true,
    instructions: ['Enter latitude and longitude for Point A and Point B.', 'View spherical great-circle distance in km, miles, and nautical miles.'],
    faqs: [{ question: 'What is the Haversine formula?', answer: 'The Haversine formula calculates the great-circle distance between two points on a sphere of radius R = 6,371 km.' }],
    relatedTools: ['travel-distance-calculator', 'bearing-calculator'],
    component: CoordinateDistanceCalculator
  },
  {
    id: 'bearing-calculator',
    name: 'Bearing & Azimuth Calculator',
    shortDescription: 'Compute forward initial navigational azimuth, compass rose heading, and 180° back bearing.',
    category: 'travel',
    iconName: 'Compass',
    keywords: ['bearing calculator', 'navigational azimuth', 'compass heading', 'forward bearing', 'back bearing'],
    instructions: ['Enter Point A (start) and Point B (destination) coordinates.', 'View initial navigation bearing in degrees (0° - 360°) and back bearing.'],
    faqs: [{ question: 'Why does bearing change along a great circle route?', answer: 'Because lines of longitude converge at the poles, following a great circle path requires continuous adjustment of your compass heading.' }],
    relatedTools: ['compass-direction-calculator', 'coordinate-distance-calculator'],
    component: BearingCalculator
  },
  {
    id: 'compass-direction-calculator',
    name: 'Compass Direction Calculator',
    shortDescription: 'Translate numeric angle degrees (0° - 360°) into 16-point cardinal compass directions (N, NNE, NE, ENE...).',
    category: 'travel',
    iconName: 'Compass',
    keywords: ['compass direction calculator', 'degrees to compass', 'cardinal direction', 'compass rose'],
    instructions: ['Adjust the angle slider or type degrees (0° to 360°).', 'View 16-point cardinal point, cardinal description, and 180° reciprocal opposite.'],
    faqs: [{ question: 'How many degrees is each point on a 16-point compass?', answer: 'Each 16-point compass division equals exactly 22.5 degrees (360° / 16).' }],
    relatedTools: ['bearing-calculator', 'gps-coordinates-formatter'],
    component: CompassDirectionCalculator
  },
  {
    id: 'map-link-generator',
    name: 'Universal Map Link Generator',
    shortDescription: 'Generate cross-platform deep links to open target coordinates in Google Maps, Apple Maps, OpenStreetMap, or Bing Maps.',
    category: 'travel',
    iconName: 'Map',
    keywords: ['map link generator', 'google maps link', 'apple maps link', 'openstreetmap link', 'geo uri'],
    isPopular: true,
    instructions: ['Enter place name and coordinates.', 'Click to open or copy direct links for Google Maps, Apple Maps, OpenStreetMap, or GeoURI.'],
    faqs: [{ question: 'Which link works on mobile devices?', answer: 'Apple Maps links open natively on iOS, Google Maps on Android, and Geo URI links prompt whichever navigation app the user prefers.' }],
    relatedTools: ['google-maps-route-builder', 'travel-location-qr-generator'],
    component: MapLinkGenerator
  },
  {
    id: 'google-maps-route-builder',
    name: 'Google Maps Route Link Builder',
    shortDescription: 'Construct custom multi-waypoint navigation links with specific travel modes (driving, walking, bicycling, transit).',
    category: 'travel',
    iconName: 'Route',
    keywords: ['google maps route builder', 'multi stop directions', 'route link generator', 'share route link'],
    instructions: ['Enter Origin, Destination, intermediate Waypoint stops, and travel mode.', 'Copy or open the generated custom Google Maps directions link.'],
    faqs: [{ question: 'Can I share this route with friends?', answer: 'Yes! The generated URL contains all origin, waypoint, and destination parameters and opens directly in the Google Maps app.' }],
    relatedTools: ['map-link-generator', 'road-trip-planner'],
    component: GoogleMapsRouteBuilder
  },
  {
    id: 'travel-location-qr-generator',
    name: 'Location QR Code Generator',
    shortDescription: 'Generate scannable QR codes containing geographic coordinates or map links for instant phone navigation.',
    category: 'travel',
    iconName: 'QrCode',
    keywords: ['location qr generator', 'maps qr code', 'gps qr code', 'share location qr'],
    isPopular: true,
    instructions: ['Enter place name and coordinates.', 'Choose Google Maps URL or RFC 5870 Geo URI format, then scan or download the QR code PNG.'],
    faqs: [{ question: 'How do other travelers use this QR code?', answer: 'Scanning the QR code with any smartphone camera opens the target coordinates directly in their default navigation app.' }],
    relatedTools: ['map-link-generator', 'gps-coordinates-formatter'],
    component: TravelLocationQrGenerator
  },

  // ==========================================
  // SECTION 5: TRAVEL DOCUMENTS & RECORDS (10 tools)
  // ==========================================
  {
    id: 'travel-document-organizer',
    name: 'Travel Document Organizer',
    shortDescription: 'Securely manage passports, national IDs, visas, and insurance policy numbers in your browser’s local storage.',
    category: 'travel',
    iconName: 'FileText',
    keywords: ['travel document organizer', 'passport vault', 'visa manager', 'travel records'],
    isPopular: true,
    instructions: ['Click Add Document to record document numbers, issuing country, and expiry dates.', 'Review real-time validity status and 6-month warnings.'],
    faqs: [{ question: 'Is my passport information safe?', answer: 'Yes. All document records are saved solely in your local browser’s IndexedDB database with zero cloud telemetry or transmission.' }],
    relatedTools: ['passport-expiry-reminder', 'emergency-travel-card'],
    component: TravelDocumentOrganizer
  },
  {
    id: 'passport-expiry-reminder',
    name: 'Passport Expiry & 6-Month Rule Checker',
    shortDescription: 'Verify if your passport meets international 6-month post-trip validity regulations to avoid boarding denials.',
    category: 'travel',
    iconName: 'Calendar',
    keywords: ['passport expiry reminder', '6 month validity rule', 'passport check', 'renewal reminder'],
    isPopular: true,
    instructions: ['Enter your passport expiry date and planned trip return date.', 'See if your passport meets international 6-month validity thresholds.'],
    faqs: [{ question: 'What happens if my passport expires in 5 months?', answer: 'Most international carriers and border agencies will deny boarding if the passport expires within 6 months of travel.' }],
    relatedTools: ['visa-expiry-reminder', 'travel-document-organizer'],
    component: PassportExpiryReminder
  },
  {
    id: 'visa-expiry-reminder',
    name: 'Visa Expiry & Stay Limit Tracker',
    shortDescription: 'Track single and multiple entry visa validity dates, Schengen 90/180 windows, and maximum stay allowances.',
    category: 'travel',
    iconName: 'Calendar',
    keywords: ['visa expiry reminder', 'stay limit tracker', 'schengen 90 180', 'visa validity'],
    instructions: ['Enter country, visa type, valid-until date, and maximum permitted stay days.'],
    faqs: [{ question: 'What is the Schengen 90/180 day rule?', answer: 'Non-EU citizens may stay in the Schengen Area for a maximum of 90 days within any rolling 180-day window.' }],
    relatedTools: ['passport-expiry-reminder', 'travel-document-organizer'],
    component: VisaExpiryReminder
  },
  {
    id: 'travel-insurance-checklist',
    name: 'Travel Insurance Policy Checklist',
    shortDescription: 'Audit policy clauses for emergency medical evacuation, trip cancellation, luggage theft, and 24/7 hotlines.',
    category: 'travel',
    iconName: 'Shield',
    keywords: ['travel insurance checklist', 'medical evacuation', 'trip cancellation insurance', 'travel protection'],
    instructions: ['Verify that your travel insurance policy satisfies emergency medical and evacuation coverage minimums.'],
    faqs: [{ question: 'What is the minimum recommended medical evacuation coverage?', answer: 'Travel medical authorities recommend at least $100,000 for emergency medical care and $250,000 for medical repatriation/evacuation.' }],
    relatedTools: ['emergency-travel-card', 'travel-document-organizer'],
    component: TravelInsuranceChecklist
  },
  {
    id: 'emergency-travel-card',
    name: 'Emergency Travel Medical Card',
    shortDescription: 'Generate a printable pocket emergency card with blood type, allergies, embassy hotlines, and next-of-kin contacts.',
    category: 'travel',
    iconName: 'Shield',
    keywords: ['emergency travel card', 'ice card', 'medical alert card', 'embassy contact card'],
    isPopular: true,
    instructions: ['Fill in traveler name, blood type, severe allergies, embassy emergency phone, and local emergency numbers.', 'Click Print Card for a wallet-sized medical summary.'],
    faqs: [{ question: 'Why carry a printed emergency medical card?', answer: 'If your phone battery dies or in the event of an accident, a physical emergency card provides medical responders with immediate life-saving information.' }],
    relatedTools: ['travel-document-organizer', 'travel-insurance-checklist'],
    component: EmergencyTravelCard
  },
  {
    id: 'hotel-booking-organizer',
    name: 'Hotel & Lodging Organizer',
    shortDescription: 'Store accommodation reservations, check-in windows, confirmation numbers, addresses, and costs offline.',
    category: 'travel',
    iconName: 'Hotel',
    keywords: ['hotel booking organizer', 'accommodation manager', 'lodging reservations', 'hotel confirmation'],
    instructions: ['Add hotel or rental property details, check-in/out dates, and confirmation codes.', 'Access addresses and check-in times offline when arriving.'],
    faqs: [{ question: 'Can I access hotel bookings without internet?', answer: 'Yes! All bookings are stored locally in your browser and remain fully accessible offline.' }],
    relatedTools: ['flight-information-organizer', 'trip-planner'],
    component: HotelBookingOrganizer
  },
  {
    id: 'flight-information-organizer',
    name: 'Flight Information & PNR Organizer',
    shortDescription: 'Store airlines, flight numbers, departure/arrival airports, assigned seats, and 6-character PNR codes.',
    category: 'travel',
    iconName: 'Plane',
    keywords: ['flight information organizer', 'flight tracker offline', 'pnr organizer', 'boarding pass reference'],
    instructions: ['Record upcoming flight numbers, routes, seats, and booking reference codes.'],
    faqs: [{ question: 'What is a PNR booking reference?', answer: 'A PNR (Passenger Name Record) is a unique 6-character alphanumeric code used by airlines to manage your itinerary.' }],
    relatedTools: ['hotel-booking-organizer', 'flight-duration-calculator'],
    component: FlightInformationOrganizer
  },
  {
    id: 'travel-expense-log',
    name: 'Travel Expense Log',
    shortDescription: 'Log itemized travel receipts, dining costs, and local transit fares with total expenditure tracking.',
    category: 'travel',
    iconName: 'DollarSign',
    keywords: ['travel expense log', 'trip expense tracker', 'vacation receipts', 'travel spending log'],
    instructions: ['Log expenses with category, description, and amount.', 'View running total spending and delete individual entries as needed.'],
    faqs: [{ question: 'How is this different from the budget planner?', answer: 'The expense log records actual real-time purchases and receipts, whereas the budget planner sets upfront allocation targets.' }],
    relatedTools: ['travel-budget-planner', 'travel-expense-splitter'],
    component: TravelExpenseLog
  },
  {
    id: 'travel-journal',
    name: 'Travel Journal & Memories',
    shortDescription: 'Capture day-by-day travel reflections, city visits, weather observations, and memorable highlights.',
    category: 'travel',
    iconName: 'BookOpen',
    keywords: ['travel journal', 'travel diary', 'vacation memories', 'travel blog notes'],
    instructions: ['Write journal entries with title, city, date, body reflections, and weather emoji.', 'Review previous entries in chronological cards.'],
    faqs: [{ question: 'Are my travel journal entries private?', answer: 'Yes, 100% private. Your journal entries never leave your device and are never uploaded to any cloud server.' }],
    relatedTools: ['trip-summary-generator', 'trip-planner'],
    component: TravelJournal
  },
  {
    id: 'trip-summary-generator',
    name: 'Trip Summary & Debrief Generator',
    shortDescription: 'Synthesize destinations visited, days traveled, total financial expenditures, highlights, and lessons learned.',
    category: 'travel',
    iconName: 'FileText',
    keywords: ['trip summary generator', 'travel debrief', 'trip report', 'vacation summary'],
    instructions: ['Fill in trip overview, destinations, duration, total spending, highlights, and lessons learned.', 'Copy formatted markdown debrief for your archives or blog.'],
    faqs: [{ question: 'How can I share the trip summary?', answer: 'Click "Copy Debrief" to copy formatted markdown text ready for email, notes apps, or personal blogging.' }],
    relatedTools: ['travel-journal', 'trip-planner'],
    component: TripSummaryGenerator
  }
];
