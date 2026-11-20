import { lazy } from 'react';
import { ToolItem } from '../types';

// Lazy load Health Calculator Tools
const BodyMassIndexCalculator = lazy(() => import('../components/tools/health/HealthCalculatorTools').then(m => ({ default: m.BodyMassIndexCalculator })));
const IdealWeightEstimator = lazy(() => import('../components/tools/health/HealthCalculatorTools').then(m => ({ default: m.IdealWeightEstimator })));
const BmrCalculator = lazy(() => import('../components/tools/health/HealthCalculatorTools').then(m => ({ default: m.BmrCalculator })));
const TdeeCalculator = lazy(() => import('../components/tools/health/HealthCalculatorTools').then(m => ({ default: m.TdeeCalculator })));
const BodyFatPercentageEstimator = lazy(() => import('../components/tools/health/HealthCalculatorTools').then(m => ({ default: m.BodyFatPercentageEstimator })));
const WaistToHeightRatioCalculator = lazy(() => import('../components/tools/health/HealthCalculatorTools').then(m => ({ default: m.WaistToHeightRatioCalculator })));
const WaistToHipRatioCalculator = lazy(() => import('../components/tools/health/HealthCalculatorTools').then(m => ({ default: m.WaistToHipRatioCalculator })));
const CalorieNeedsCalculator = lazy(() => import('../components/tools/health/HealthCalculatorTools').then(m => ({ default: m.CalorieNeedsCalculator })));
const WaterIntakeEstimator = lazy(() => import('../components/tools/health/HealthCalculatorTools').then(m => ({ default: m.WaterIntakeEstimator })));
const ProteinIntakeCalculator = lazy(() => import('../components/tools/health/HealthCalculatorTools').then(m => ({ default: m.ProteinIntakeCalculator })));
const AgeFitnessCalculator = lazy(() => import('../components/tools/health/HealthCalculatorTools').then(m => ({ default: m.AgeFitnessCalculator })));
const PregnancyDueDateCalculator = lazy(() => import('../components/tools/health/HealthCalculatorTools').then(m => ({ default: m.PregnancyDueDateCalculator })));
const OvulationDateEstimator = lazy(() => import('../components/tools/health/HealthCalculatorTools').then(m => ({ default: m.OvulationDateEstimator })));
const HeartRateZoneCalculator = lazy(() => import('../components/tools/health/HealthCalculatorTools').then(m => ({ default: m.HeartRateZoneCalculator })));
const TargetHeartRateCalculator = lazy(() => import('../components/tools/health/HealthCalculatorTools').then(m => ({ default: m.TargetHeartRateCalculator })));

// Lazy load Fitness & Workout Tools
const WorkoutPlanner = lazy(() => import('../components/tools/health/FitnessWorkoutTools').then(m => ({ default: m.WorkoutPlanner })));
const DailyExerciseTracker = lazy(() => import('../components/tools/health/FitnessWorkoutTools').then(m => ({ default: m.DailyExerciseTracker })));
const PushUpCounter = lazy(() => import('../components/tools/health/FitnessWorkoutTools').then(m => ({ default: m.PushUpCounter })));
const SquatCounter = lazy(() => import('../components/tools/health/FitnessWorkoutTools').then(m => ({ default: m.SquatCounter })));
const PlankTimer = lazy(() => import('../components/tools/health/FitnessWorkoutTools').then(m => ({ default: m.PlankTimer })));
const RunningPaceCalculator = lazy(() => import('../components/tools/health/FitnessWorkoutTools').then(m => ({ default: m.RunningPaceCalculator })));
const RunningDistanceCalculator = lazy(() => import('../components/tools/health/FitnessWorkoutTools').then(m => ({ default: m.RunningDistanceCalculator })));
const WalkingPaceCalculator = lazy(() => import('../components/tools/health/FitnessWorkoutTools').then(m => ({ default: m.WalkingPaceCalculator })));
const StepsToDistanceCalculator = lazy(() => import('../components/tools/health/FitnessWorkoutTools').then(m => ({ default: m.StepsToDistanceCalculator })));
const ExerciseCalorieEstimator = lazy(() => import('../components/tools/health/FitnessWorkoutTools').then(m => ({ default: m.ExerciseCalorieEstimator })));
const OneRepMaxCalculator = lazy(() => import('../components/tools/health/FitnessWorkoutTools').then(m => ({ default: m.OneRepMaxCalculator })));
const WorkoutRestTimer = lazy(() => import('../components/tools/health/FitnessWorkoutTools').then(m => ({ default: m.WorkoutRestTimer })));
const IntervalTrainingTimer = lazy(() => import('../components/tools/health/FitnessWorkoutTools').then(m => ({ default: m.IntervalTrainingTimer })));
const FitnessGoalTracker = lazy(() => import('../components/tools/health/FitnessWorkoutTools').then(m => ({ default: m.FitnessGoalTracker })));
const WeeklyWorkoutSchedule = lazy(() => import('../components/tools/health/FitnessWorkoutTools').then(m => ({ default: m.WeeklyWorkoutSchedule })));

// Lazy load Nutrition & Diet Tools
const CalorieTracker = lazy(() => import('../components/tools/health/NutritionDietTools').then(m => ({ default: m.CalorieTracker })));
const FoodNutritionCalculator = lazy(() => import('../components/tools/health/NutritionDietTools').then(m => ({ default: m.FoodNutritionCalculator })));
const MacronutrientCalculator = lazy(() => import('../components/tools/health/NutritionDietTools').then(m => ({ default: m.MacronutrientCalculator })));
const ProteinTracker = lazy(() => import('../components/tools/health/NutritionDietTools').then(m => ({ default: m.ProteinTracker })));
const MealPlanner = lazy(() => import('../components/tools/health/NutritionDietTools').then(m => ({ default: m.MealPlanner })));
const DailyFoodDiary = lazy(() => import('../components/tools/health/NutritionDietTools').then(m => ({ default: m.DailyFoodDiary })));
const PortionSizeConverter = lazy(() => import('../components/tools/health/NutritionDietTools').then(m => ({ default: m.PortionSizeConverter })));
const RecipeNutritionEstimator = lazy(() => import('../components/tools/health/NutritionDietTools').then(m => ({ default: m.RecipeNutritionEstimator })));
const CalorieDeficitCalculator = lazy(() => import('../components/tools/health/NutritionDietTools').then(m => ({ default: m.CalorieDeficitCalculator })));
const CalorieSurplusCalculator = lazy(() => import('../components/tools/health/NutritionDietTools').then(m => ({ default: m.CalorieSurplusCalculator })));
const SugarIntakeTracker = lazy(() => import('../components/tools/health/NutritionDietTools').then(m => ({ default: m.SugarIntakeTracker })));
const FiberIntakeTracker = lazy(() => import('../components/tools/health/NutritionDietTools').then(m => ({ default: m.FiberIntakeTracker })));
const FoodLabelAnalyzer = lazy(() => import('../components/tools/health/NutritionDietTools').then(m => ({ default: m.FoodLabelAnalyzer })));
const MealCalorieSplitCalculator = lazy(() => import('../components/tools/health/NutritionDietTools').then(m => ({ default: m.MealCalorieSplitCalculator })));
const DailyNutritionSummary = lazy(() => import('../components/tools/health/NutritionDietTools').then(m => ({ default: m.DailyNutritionSummary })));

// Lazy load Sleep & Wellness Tools
const SleepCalculator = lazy(() => import('../components/tools/health/SleepWellnessTools').then(m => ({ default: m.SleepCalculator })));
const SleepTracker = lazy(() => import('../components/tools/health/SleepWellnessTools').then(m => ({ default: m.SleepTracker })));
const SleepCyclePlanner = lazy(() => import('../components/tools/health/SleepWellnessTools').then(m => ({ default: m.SleepCyclePlanner })));
const BedtimeCalculator = lazy(() => import('../components/tools/health/SleepWellnessTools').then(m => ({ default: m.BedtimeCalculator })));
const WakeUpTimeCalculator = lazy(() => import('../components/tools/health/SleepWellnessTools').then(m => ({ default: m.WakeUpTimeCalculator })));
const RelaxationTimer = lazy(() => import('../components/tools/health/SleepWellnessTools').then(m => ({ default: m.RelaxationTimer })));
const MeditationTimer = lazy(() => import('../components/tools/health/SleepWellnessTools').then(m => ({ default: m.MeditationTimer })));
const BreathingExerciseTimer = lazy(() => import('../components/tools/health/SleepWellnessTools').then(m => ({ default: m.BreathingExerciseTimer })));
const MoodTracker = lazy(() => import('../components/tools/health/SleepWellnessTools').then(m => ({ default: m.MoodTracker })));
const DailyWellnessJournal = lazy(() => import('../components/tools/health/SleepWellnessTools').then(m => ({ default: m.DailyWellnessJournal })));
const WellnessHabitTracker = lazy(() => import('../components/tools/health/SleepWellnessTools').then(m => ({ default: m.WellnessHabitTracker })));
const StressJournal = lazy(() => import('../components/tools/health/SleepWellnessTools').then(m => ({ default: m.StressJournal })));
const ScreenTimeTracker = lazy(() => import('../components/tools/health/SleepWellnessTools').then(m => ({ default: m.ScreenTimeTracker })));
const DailySelfCareChecklist = lazy(() => import('../components/tools/health/SleepWellnessTools').then(m => ({ default: m.DailySelfCareChecklist })));
const WeeklyWellnessSummary = lazy(() => import('../components/tools/health/SleepWellnessTools').then(m => ({ default: m.WeeklyWellnessSummary })));

// Lazy load Personal Health Records
const PersonalHealthJournal = lazy(() => import('../components/tools/health/PersonalHealthRecordTools').then(m => ({ default: m.PersonalHealthJournal })));
const MedicationReminder = lazy(() => import('../components/tools/health/PersonalHealthRecordTools').then(m => ({ default: m.MedicationReminder })));
const AppointmentReminderTool = lazy(() => import('../components/tools/health/PersonalHealthRecordTools').then(m => ({ default: m.AppointmentReminderTool })));
const MedicalReportOrganizer = lazy(() => import('../components/tools/health/PersonalHealthRecordTools').then(m => ({ default: m.MedicalReportOrganizer })));
const BloodPressureLogTool = lazy(() => import('../components/tools/health/PersonalHealthRecordTools').then(m => ({ default: m.BloodPressureLogTool })));
const BloodSugarLogTool = lazy(() => import('../components/tools/health/PersonalHealthRecordTools').then(m => ({ default: m.BloodSugarLogTool })));
const WeightHistoryTracker = lazy(() => import('../components/tools/health/PersonalHealthRecordTools').then(m => ({ default: m.WeightHistoryTracker })));
const BodyMeasurementsTracker = lazy(() => import('../components/tools/health/PersonalHealthRecordTools').then(m => ({ default: m.BodyMeasurementsTracker })));
const HealthNotesTool = lazy(() => import('../components/tools/health/PersonalHealthRecordTools').then(m => ({ default: m.HealthNotesTool })));
const EmergencyMedicalCardTool = lazy(() => import('../components/tools/health/PersonalHealthRecordTools').then(m => ({ default: m.EmergencyMedicalCardTool })));

export const HEALTH_TOOLS_REGISTRY: ToolItem[] = [
  // ==========================================
  // 1. Health Calculators (15 Tools)
  // ==========================================
  {
    id: 'body-mass-index-calculator',
    name: 'BMI Calculator (Adult & Child)',
    shortDescription: 'Calculate Body Mass Index, WHO categories, Asian population cutoffs, BMI Prime, and Ponderal Index.',
    category: 'health',
    iconName: 'Activity',
    keywords: ['bmi', 'body mass index', 'weight', 'health', 'asian bmi', 'ponderal index'],
    isPopular: true,
    instructions: ['Enter height and body weight in metric or imperial units.', 'Review calculated BMI, Prime, and healthy weight boundary range.'],
    faqs: [{ question: 'What is BMI Prime?', answer: 'BMI Prime is the ratio of actual BMI to the upper limit of normal BMI (25). A Prime < 1.0 indicates normal weight.' }],
    relatedTools: ['ideal-weight-estimator', 'body-fat-percentage-estimator'],
    component: BodyMassIndexCalculator
  },
  {
    id: 'ideal-weight-estimator',
    name: 'Ideal Body Weight Estimator',
    shortDescription: 'Estimate ideal body weight using Devine, Robinson, Miller, and Hamwi clinical pharmacology formulas.',
    category: 'health',
    iconName: 'Scale',
    keywords: ['ideal weight', 'healthy weight', 'devine formula', 'target weight'],
    instructions: ['Select gender and height in centimeters or feet/inches.', 'Compare values across 4 established pharmacological equations.'],
    faqs: [{ question: 'Which ideal weight formula is most accurate?', answer: 'The Devine formula is the standard clinical benchmark used in medicine and pharmacology.' }],
    relatedTools: ['body-mass-index-calculator', 'waist-to-height-ratio-calculator'],
    component: IdealWeightEstimator
  },
  {
    id: 'bmr-calculator',
    name: 'BMR Calculator (Mifflin & Harris)',
    shortDescription: 'Calculate Basal Metabolic Rate using Mifflin-St Jeor, Revised Harris-Benedict, and Katch-McArdle.',
    category: 'health',
    iconName: 'Flame',
    keywords: ['bmr', 'basal metabolic rate', 'metabolism', 'calories resting'],
    instructions: ['Enter gender, age, weight, and height.', 'Optionally provide body fat % for Katch-McArdle lean mass formula.'],
    faqs: [{ question: 'What is BMR?', answer: 'BMR is the base number of calories required to maintain essential organ function at total rest.' }],
    relatedTools: ['tdee-calculator', 'calorie-needs-calculator'],
    component: BmrCalculator
  },
  {
    id: 'tdee-calculator',
    name: 'TDEE Calculator (Total Energy Expenditure)',
    shortDescription: 'Calculate Total Daily Energy Expenditure by factoring physical activity multiplier into BMR.',
    category: 'health',
    iconName: 'Activity',
    keywords: ['tdee', 'total daily energy expenditure', 'maintenance calories', 'active metabolism'],
    isPopular: true,
    instructions: ['Input personal metrics and choose your weekly physical activity level.', 'View maintenance, fat loss, and muscle gain daily calorie targets.'],
    faqs: [{ question: 'How is TDEE calculated?', answer: 'TDEE = BMR × Physical Activity Factor (ranging from 1.2 for sedentary to 1.9 for athletes).' }],
    relatedTools: ['bmr-calculator', 'calorie-deficit-calculator'],
    component: TdeeCalculator
  },
  {
    id: 'body-fat-percentage-estimator',
    name: 'Body Fat Percentage Estimator',
    shortDescription: 'Estimate body fat percentage using the US Navy circumference method with lean mass breakdown.',
    category: 'health',
    iconName: 'Activity',
    keywords: ['body fat', 'navy method', 'lean mass', 'fat mass', 'composition'],
    instructions: ['Measure waist, neck, and hip (for females) circumferences with a flexible tape.', 'Review estimated body fat percentage and fitness category.'],
    faqs: [{ question: 'How accurate is the US Navy tape method?', answer: 'It typically has a ±3-4% variance compared to clinical DEXA scans when measurements are accurate.' }],
    relatedTools: ['body-mass-index-calculator', 'waist-to-hip-ratio-calculator'],
    component: BodyFatPercentageEstimator
  },
  {
    id: 'waist-to-height-ratio-calculator',
    name: 'Waist-to-Height Ratio Calculator',
    shortDescription: 'Calculate Waist-to-Height Ratio (WHtR) to assess cardiometabolic health and abdominal visceral fat.',
    category: 'health',
    iconName: 'Scale',
    keywords: ['waist to height', 'whtr', 'visceral fat', 'health risk', 'abdominal obesity'],
    instructions: ['Enter waist circumference at navel level and height in centimeters.', 'Maintain waist below half of height for low health risk.'],
    faqs: [{ question: 'Why is WHtR important?', answer: 'Research suggests WHtR is often a better predictor of cardiovascular risk than BMI alone.' }],
    relatedTools: ['waist-to-hip-ratio-calculator', 'body-mass-index-calculator'],
    component: WaistToHeightRatioCalculator
  },
  {
    id: 'waist-to-hip-ratio-calculator',
    name: 'Waist-to-Hip Ratio Calculator',
    shortDescription: 'Calculate Waist-to-Hip Ratio (WHR) and evaluate WHO body fat distribution health risk.',
    category: 'health',
    iconName: 'Scale',
    keywords: ['waist to hip', 'whr', 'body shape', 'android', 'gynoid'],
    instructions: ['Enter waist circumference at narrowest point and hip at widest point.', 'Compare ratio to WHO cardiovascular risk cutoffs.'],
    faqs: [{ question: 'What is a healthy WHR?', answer: 'WHO defines healthy WHR as under 0.90 for men and under 0.85 for women.' }],
    relatedTools: ['waist-to-height-ratio-calculator', 'body-fat-percentage-estimator'],
    component: WaistToHipRatioCalculator
  },
  {
    id: 'calorie-needs-calculator',
    name: 'Calorie Needs Calculator',
    shortDescription: 'Calculate daily caloric targets for maintenance, steady fat loss, aggressive deficit, or clean bulking.',
    category: 'health',
    iconName: 'Flame',
    keywords: ['calorie needs', 'daily calories', 'cutting', 'bulking', 'maintenance'],
    instructions: ['Enter body stats and select goal.', 'Receive custom daily calorie targets.'],
    faqs: [{ question: 'What is a safe calorie deficit?', answer: 'A deficit of 300 to 500 kcal/day is considered safe, yielding ~0.25 to 0.5 kg of fat loss weekly.' }],
    relatedTools: ['tdee-calculator', 'calorie-deficit-calculator'],
    component: CalorieNeedsCalculator
  },
  {
    id: 'water-intake-estimator',
    name: 'Daily Water Intake Estimator',
    shortDescription: 'Calculate optimal daily hydration requirements based on body weight, exercise duration, and climate.',
    category: 'health',
    iconName: 'Droplet',
    keywords: ['water intake', 'hydration', 'fluid needs', 'liters water', 'glasses'],
    instructions: ['Input body weight and minutes of planned daily exercise.', 'View recommended liters and standard 8oz glasses per day.'],
    faqs: [{ question: 'Does tea or coffee count toward hydration?', answer: 'Moderate coffee and tea contribute to hydration, but water remains the gold standard.' }],
    relatedTools: ['calorie-needs-calculator', 'protein-intake-calculator'],
    component: WaterIntakeEstimator
  },
  {
    id: 'protein-intake-calculator',
    name: 'Protein Intake Calculator',
    shortDescription: 'Determine optimal daily protein intake based on weight, lifestyle, endurance, and hypertrophy goals.',
    category: 'health',
    iconName: 'Apple',
    keywords: ['protein intake', 'protein needs', 'muscle building', 'grams protein', 'hypertrophy'],
    instructions: ['Enter body weight in kg and select your athletic training discipline.', 'Review minimum and maximum recommended daily protein in grams.'],
    faqs: [{ question: 'How much protein is needed for muscle gain?', answer: 'Sports science recommends 1.6 to 2.2 grams of protein per kilogram of body weight.' }],
    relatedTools: ['macronutrient-calculator', 'calorie-needs-calculator'],
    component: ProteinIntakeCalculator
  },
  {
    id: 'age-fitness-calculator',
    name: 'Fitness Age & Aerobic Health Estimator',
    shortDescription: 'Estimate your cardiovascular fitness age based on resting heart rate, BMI, and weekly exercise frequency.',
    category: 'health',
    iconName: 'HeartPulse',
    keywords: ['fitness age', 'biological age', 'aerobic fitness', 'resting heart rate'],
    instructions: ['Enter calendar age, resting heart rate, weekly workout days, and BMI.', 'Compare estimated fitness age to chronological age.'],
    faqs: [{ question: 'Can fitness age be reduced?', answer: 'Yes! Consistent aerobic training and lowering resting heart rate can reduce fitness age significantly.' }],
    relatedTools: ['heart-rate-zone-calculator', 'body-mass-index-calculator'],
    component: AgeFitnessCalculator
  },
  {
    id: 'pregnancy-due-date-calculator',
    name: 'Pregnancy Due Date Calculator',
    shortDescription: 'Estimate estimated delivery date (EDD), gestational age, and trimester boundaries using Naegele’s rule.',
    category: 'health',
    iconName: 'Baby',
    keywords: ['pregnancy', 'due date', 'edd', 'gestational age', 'trimester', 'baby'],
    instructions: ['Select first day of last menstrual period (LMP) and average cycle length.', 'View estimated due date, conception timeline, and current trimester.'],
    faqs: [{ question: 'How accurate is Naegele’s rule?', answer: 'It calculates an approximate 40-week timeline. Clinical ultrasound dating is the gold standard.' }],
    relatedTools: ['ovulation-date-estimator'],
    component: PregnancyDueDateCalculator
  },
  {
    id: 'ovulation-date-estimator',
    name: 'Ovulation Date & Fertile Window Estimator',
    shortDescription: 'Estimate biological ovulation dates and fertile windows based on menstrual cycle lengths.',
    category: 'health',
    iconName: 'Calendar',
    keywords: ['ovulation', 'fertile window', 'fertility', 'menstrual cycle'],
    instructions: ['Enter first day of last period and typical cycle duration in days.', 'Review projected ovulation date and 6-day fertile window.'],
    faqs: [{ question: 'Can this be used for birth control?', answer: 'No! Biological cycles fluctuate naturally. Never use mathematical estimators as contraception.' }],
    relatedTools: ['pregnancy-due-date-calculator'],
    component: OvulationDateEstimator
  },
  {
    id: 'heart-rate-zone-calculator',
    name: 'Heart Rate Zone Calculator',
    shortDescription: 'Calculate 5 targeted cardiovascular heart rate zones using Tanaka and Karvonen reserve formulas.',
    category: 'health',
    iconName: 'HeartPulse',
    keywords: ['heart rate zones', 'karvonen', 'max hr', 'aerobic', 'anaerobic', 'fat burn'],
    instructions: ['Enter age and resting heart rate.', 'View custom BPM ranges for Recovery, Aerobic, Threshold, and Maximum zones.'],
    faqs: [{ question: 'What is the Karvonen formula?', answer: 'Target HR = Resting HR + (Max HR - Resting HR) × Intensity %.' }],
    relatedTools: ['target-heart-rate-calculator', 'age-fitness-calculator'],
    component: HeartRateZoneCalculator
  },
  {
    id: 'target-heart-rate-calculator',
    name: 'Target Heart Rate Calculator',
    shortDescription: 'Quickly find moderate (50-70%) and vigorous (70-85%) cardiovascular training target heart rates.',
    category: 'health',
    iconName: 'Heart',
    keywords: ['target heart rate', 'cardio zones', 'exercise intensity', 'bpm target'],
    instructions: ['Input your age.', 'View target BPM boundaries for moderate vs vigorous exercise.'],
    faqs: [{ question: 'What is the talk test?', answer: 'During moderate intensity you can talk; during vigorous intensity you need to pause for breath.' }],
    relatedTools: ['heart-rate-zone-calculator'],
    component: TargetHeartRateCalculator
  },

  // ==========================================
  // 2. Fitness & Workout Tools (15 Tools)
  // ==========================================
  {
    id: 'workout-planner',
    name: 'Workout Planner',
    shortDescription: 'Create custom gym and home workout routines with exercise names, sets, reps, and rest periods.',
    category: 'health',
    iconName: 'Dumbbell',
    keywords: ['workout planner', 'routine builder', 'gym split', 'exercise program'],
    isPopular: true,
    instructions: ['Enter a routine title and add exercises with target sets and reps.', 'Copy or export your finished routine.'],
    faqs: [{ question: 'Are workout plans saved locally?', answer: 'Yes, routine details can be copied and saved to your device with zero cloud tracking.' }],
    relatedTools: ['weekly-workout-schedule', 'daily-exercise-tracker'],
    component: WorkoutPlanner
  },
  {
    id: 'daily-exercise-tracker',
    name: 'Daily Exercise Tracker',
    shortDescription: 'Log daily workout sessions, training duration, and perceived exertion levels in local storage.',
    category: 'health',
    iconName: 'Activity',
    keywords: ['exercise tracker', 'workout log', 'activity tracker', 'fitness history'],
    instructions: ['Log date, activity title, duration, and perceived exertion (1-10).', 'View historical logs saved in IndexedDB.'],
    faqs: [{ question: 'Where is workout history stored?', answer: 'In your browser’s private IndexedDB database. You can export it anytime via Backup & Restore.' }],
    relatedTools: ['workout-planner', 'exercise-calorie-estimator'],
    component: DailyExerciseTracker
  },
  {
    id: 'push-up-counter',
    name: 'Push-up Counter',
    shortDescription: 'Interactive manual tap repetition counter and set logger with audio feedback for push-up training.',
    category: 'health',
    iconName: 'Dumbbell',
    keywords: ['push up counter', 'reps tracker', 'calisthenics', 'chest workout'],
    instructions: ['Tap the large button for each completed push-up.', 'Click Log Set to save your set count.'],
    faqs: [{ question: 'Does this use my camera?', answer: 'No! Browser tools rely on manual tap or cadence metronomes without intrusive camera access.' }],
    relatedTools: ['squat-counter', 'plank-timer'],
    component: PushUpCounter
  },
  {
    id: 'squat-counter',
    name: 'Squat Counter',
    shortDescription: 'Interactive manual tap repetition counter and set logger with audio cues for squat workouts.',
    category: 'health',
    iconName: 'Dumbbell',
    keywords: ['squat counter', 'leg day', 'reps', 'lower body'],
    instructions: ['Tap the circle after each squat repetition.', 'Log sets and view total volume.'],
    faqs: [{ question: 'Is sound customizable?', answer: 'A gentle Web Audio sine beep confirms each counted repetition.' }],
    relatedTools: ['push-up-counter', 'plank-timer'],
    component: SquatCounter
  },
  {
    id: 'plank-timer',
    name: 'Plank Timer',
    shortDescription: 'Visual countdown timer with progress ring and finish bell for core stability and plank holds.',
    category: 'health',
    iconName: 'Clock',
    keywords: ['plank timer', 'core workout', 'isometric', 'countdown plank'],
    instructions: ['Select preset hold time (30s, 60s, 90s, 120s) and press Start.', 'Hold plank until audio completion bell rings.'],
    faqs: [{ question: 'What is a good plank duration for beginners?', answer: 'Holding a proper form plank for 30 to 60 seconds is an excellent foundation.' }],
    relatedTools: ['workout-rest-timer', 'interval-training-timer'],
    component: PlankTimer
  },
  {
    id: 'running-pace-calculator',
    name: 'Running Pace Calculator',
    shortDescription: 'Calculate exact running pace per kilometer and per mile from total distance and running time.',
    category: 'health',
    iconName: 'Activity',
    keywords: ['running pace', 'pace calculator', 'min per km', 'min per mile', 'speed'],
    isPopular: true,
    instructions: ['Enter distance in km or miles, followed by time in hours, minutes, and seconds.', 'View pace/km, pace/mile, and average speed.'],
    faqs: [{ question: 'How is running pace defined?', answer: 'Pace is the amount of time required to cover a unit distance (e.g. 5:00 /km).' }],
    relatedTools: ['running-distance-calculator', 'walking-pace-calculator'],
    component: RunningPaceCalculator
  },
  {
    id: 'running-distance-calculator',
    name: 'Running Distance Calculator',
    shortDescription: 'Calculate total distance covered based on your running pace and duration.',
    category: 'health',
    iconName: 'Activity',
    keywords: ['running distance', 'pace distance', 'miles run', 'km run'],
    instructions: ['Input your running pace per km and total running time.', 'View calculated kilometers and miles.'],
    faqs: [{ question: 'Can this estimate race splits?', answer: 'Yes, it accurately calculates total distance covered across any time window.' }],
    relatedTools: ['running-pace-calculator', 'steps-to-distance-calculator'],
    component: RunningDistanceCalculator
  },
  {
    id: 'walking-pace-calculator',
    name: 'Walking Pace Calculator',
    shortDescription: 'Calculate walking speed in km/h and minutes per kilometer for brisk and casual walks.',
    category: 'health',
    iconName: 'Footprints',
    keywords: ['walking pace', 'walking speed', 'brisk walk', 'stride pace'],
    instructions: ['Enter walked distance and total minutes.', 'View walking pace and speed.'],
    faqs: [{ question: 'What is brisk walking speed?', answer: 'Brisk walking is typically 5.0 to 6.0 km/h (10 to 12 minutes per kilometer).' }],
    relatedTools: ['steps-to-distance-calculator', 'running-pace-calculator'],
    component: WalkingPaceCalculator
  },
  {
    id: 'steps-to-distance-calculator',
    name: 'Steps-to-Distance Calculator',
    shortDescription: 'Convert daily step counts into kilometers, miles, and estimated walking calories based on height.',
    category: 'health',
    iconName: 'Footprints',
    keywords: ['steps to distance', 'pedometer converter', '10000 steps', 'miles walked'],
    instructions: ['Enter step count, height, and gender.', 'View estimated distance in km, miles, and calories burned.'],
    faqs: [{ question: 'How far is 10,000 steps?', answer: 'For an average adult, 10,000 steps equals roughly 7.5 to 8.0 kilometers (4.7 to 5.0 miles).' }],
    relatedTools: ['walking-pace-calculator', 'exercise-calorie-estimator'],
    component: StepsToDistanceCalculator
  },
  {
    id: 'exercise-calorie-estimator',
    name: 'Exercise Calorie Estimator (METs)',
    shortDescription: 'Estimate calories burned across 20+ sports and physical activities using scientific MET values.',
    category: 'health',
    iconName: 'Flame',
    keywords: ['calories burned', 'mets', 'workout calories', 'exercise energy'],
    instructions: ['Select activity type, input body weight and workout duration in minutes.', 'View calculated energy expenditure in kcal.'],
    faqs: [{ question: 'What is a MET?', answer: 'MET (Metabolic Equivalent of Task) measures the energy cost of physical activity compared to resting.' }],
    relatedTools: ['daily-exercise-tracker', 'calorie-needs-calculator'],
    component: ExerciseCalorieEstimator
  },
  {
    id: 'one-rep-max-calculator',
    name: 'One Rep Max (1RM) Calculator',
    shortDescription: 'Calculate 1RM strength benchmark using Brzycki, Epley, and Lander formulas with percentage table.',
    category: 'health',
    iconName: 'Dumbbell',
    keywords: ['1rm', 'one rep max', 'strength training', 'brzycki', 'epley', 'bench press'],
    isPopular: true,
    instructions: ['Enter weight lifted and repetitions performed (1 to 10 reps are most accurate).', 'Review estimated maximum and percentage load chart.'],
    faqs: [{ question: 'Why calculate 1RM instead of testing it directly?', answer: 'Estimating 1RM from submaximal sets avoids the extreme injury risk of maximal lifting.' }],
    relatedTools: ['workout-planner', 'protein-intake-calculator'],
    component: OneRepMaxCalculator
  },
  {
    id: 'workout-rest-timer',
    name: 'Workout Rest Timer',
    shortDescription: 'Quick interval rest timer (30s to 180s) with audio chimes to pace rest intervals between sets.',
    category: 'health',
    iconName: 'Clock',
    keywords: ['rest timer', 'gym timer', 'between sets', 'rest intervals'],
    instructions: ['Click desired rest duration (e.g. 60s or 90s).', 'Audio chime signals when to start your next set.'],
    faqs: [{ question: 'How long should I rest between sets?', answer: 'Hypertrophy typically benefits from 60-90s; heavy compound strength training benefits from 2-3 minutes.' }],
    relatedTools: ['plank-timer', 'interval-training-timer'],
    component: WorkoutRestTimer
  },
  {
    id: 'interval-training-timer',
    name: 'Interval Training Timer (HIIT & Tabata)',
    shortDescription: 'Programmable interval timer for Tabata and HIIT workouts with work/rest alerts and round tracking.',
    category: 'health',
    iconName: 'Clock',
    keywords: ['hiit timer', 'tabata timer', 'interval training', 'work rest'],
    instructions: ['Set work seconds (e.g. 20s), rest seconds (e.g. 10s), and total rounds.', 'Press Start to begin audio-guided interval cycles.'],
    faqs: [{ question: 'What is standard Tabata protocol?', answer: '8 rounds of 20 seconds maximum effort work followed by 10 seconds rest (4 minutes total).' }],
    relatedTools: ['workout-rest-timer', 'plank-timer'],
    component: IntervalTrainingTimer
  },
  {
    id: 'fitness-goal-tracker',
    name: 'Fitness Goal Tracker',
    shortDescription: 'Track long-term fitness milestones for running times, lifting numbers, and body measurements.',
    category: 'health',
    iconName: 'Activity',
    keywords: ['fitness goals', 'milestones', 'target progress', 'gym goals'],
    instructions: ['Set milestone targets and track current numbers against percentage progress bars.'],
    faqs: [{ question: 'How many fitness goals should I track at once?', answer: 'Focusing on 2 to 3 key priorities yields better adherence than tracking dozens simultaneously.' }],
    relatedTools: ['workout-planner', 'daily-exercise-tracker'],
    component: FitnessGoalTracker
  },
  {
    id: 'weekly-workout-schedule',
    name: 'Weekly Workout Schedule (Splits)',
    shortDescription: 'Organize your 7-day training schedule across Push/Pull/Legs, Upper/Lower, or Full Body splits.',
    category: 'health',
    iconName: 'Calendar',
    keywords: ['workout schedule', 'training split', 'weekly split', 'push pull legs'],
    instructions: ['Customize daily focus areas across Monday through Sunday.'],
    faqs: [{ question: 'What is a good workout split for beginners?', answer: '3 days of full-body workouts with a rest day between each session is optimal.' }],
    relatedTools: ['workout-planner', 'daily-exercise-tracker'],
    component: WeeklyWorkoutSchedule
  },

  // ==========================================
  // 3. Nutrition & Diet Tools (15 Tools)
  // ==========================================
  {
    id: 'calorie-tracker',
    name: 'Calorie Tracker',
    shortDescription: 'Log meals and snacks throughout the day against a personalized daily calorie intake budget.',
    category: 'health',
    iconName: 'Apple',
    keywords: ['calorie tracker', 'food counter', 'daily calories', 'meal log'],
    isPopular: true,
    instructions: ['Set your target calories and log foods eaten across Breakfast, Lunch, Dinner, and Snacks.'],
    faqs: [{ question: 'Is my food log private?', answer: 'Yes, 100% stored in your browser without any external cloud synchronization.' }],
    relatedTools: ['macronutrient-calculator', 'food-nutrition-calculator'],
    component: CalorieTracker
  },
  {
    id: 'food-nutrition-calculator',
    name: 'Food Nutrition Calculator (Portion Scaling)',
    shortDescription: 'Scale nutrition facts from a 100g base reference to any custom weighed serving size.',
    category: 'health',
    iconName: 'Scale',
    keywords: ['nutrition calculator', 'portion scaling', 'food scale', 'calories per gram'],
    instructions: ['Enter 100g base nutrition values, then input actual consumed weight in grams.'],
    faqs: [{ question: 'How does portion scaling work?', answer: 'It multiplies nutrients by the exact ratio: (consumed grams / reference grams).' }],
    relatedTools: ['calorie-tracker', 'portion-size-converter'],
    component: FoodNutritionCalculator
  },
  {
    id: 'macronutrient-calculator',
    name: 'Macronutrient Calculator',
    shortDescription: 'Distribute daily calorie targets into exact gram targets for carbohydrates, proteins, and fats.',
    category: 'health',
    iconName: 'PieChart',
    keywords: ['macronutrients', 'macro calculator', 'carbs protein fat', 'macro split'],
    instructions: ['Enter total daily calories and select a dietary distribution preset (Balanced, Keto, High Protein).', 'View target grams for each macro.'],
    faqs: [{ question: 'How many calories are in each macronutrient?', answer: 'Carbohydrates = 4 kcal/g, Protein = 4 kcal/g, Fat = 9 kcal/g.' }],
    relatedTools: ['protein-tracker', 'calorie-needs-calculator'],
    component: MacronutrientCalculator
  },
  {
    id: 'protein-tracker',
    name: 'Daily Protein Tracker',
    shortDescription: 'Track daily protein intake in grams against optimal targets with interactive progress ring.',
    category: 'health',
    iconName: 'Apple',
    keywords: ['protein tracker', 'grams protein', 'hypertrophy tracking', 'protein target'],
    instructions: ['Set your daily target in grams and click quick-add buttons or custom amounts throughout the day.'],
    faqs: [{ question: 'Should protein be evenly distributed across meals?', answer: 'Consuming 25-40g of protein across 3-4 meals optimizes muscle protein synthesis.' }],
    relatedTools: ['protein-intake-calculator', 'macronutrient-calculator'],
    component: ProteinTracker
  },
  {
    id: 'meal-planner',
    name: 'Meal Planner',
    shortDescription: 'Organize healthy weekly meals across Breakfast, Lunch, Dinner, and Snacks with local notes.',
    category: 'health',
    iconName: 'Utensils',
    keywords: ['meal planner', 'weekly menu', 'diet plan', 'healthy meals'],
    instructions: ['Draft clean meal ideas for each meal slot and export or print your weekly menu.'],
    faqs: [{ question: 'Can I customize the meal slots?', answer: 'Yes, each meal block is editable and saved locally on your device.' }],
    relatedTools: ['daily-food-diary', 'recipe-nutrition-estimator'],
    component: MealPlanner
  },
  {
    id: 'daily-food-diary',
    name: 'Daily Food & Symptom Diary',
    shortDescription: 'Record daily meals alongside physical energy, satiety, and digestive observations.',
    category: 'health',
    iconName: 'FileText',
    keywords: ['food diary', 'symptom tracker', 'food intolerance', 'digestive log'],
    instructions: ['Log meal contents and annotate digestive comfort or afternoon energy levels.'],
    faqs: [{ question: 'Why track food symptoms?', answer: 'A food diary helps identify personal food intolerances and energy dips.' }],
    relatedTools: ['meal-planner', 'calorie-tracker'],
    component: DailyFoodDiary
  },
  {
    id: 'portion-size-converter',
    name: 'Portion Size Converter',
    shortDescription: 'Convert between kitchen units (cups, tbsp, tsp, grams, oz) and visual hand portion estimates.',
    category: 'health',
    iconName: 'Scale',
    keywords: ['portion sizes', 'hand guide', 'serving sizes', 'cups to grams'],
    instructions: ['Consult visual hand portion guides (palm, fist, thumb) and standard cooking multipliers.'],
    faqs: [{ question: 'How much is a palm-sized portion of protein?', answer: 'A palm represents roughly 85-110 grams of cooked meat or poultry (approx. 20-30g protein).' }],
    relatedTools: ['food-nutrition-calculator'],
    component: PortionSizeConverter
  },
  {
    id: 'recipe-nutrition-estimator',
    name: 'Recipe Nutrition Estimator',
    shortDescription: 'Calculate total recipe calories and protein, automatically dividing by the number of servings.',
    category: 'health',
    iconName: 'Utensils',
    keywords: ['recipe nutrition', 'batch calories', 'serving calculator', 'meal prep'],
    instructions: ['Enter recipe ingredients with their calories/protein and set your serving count.'],
    faqs: [{ question: 'Can this be used for batch meal prep?', answer: 'Yes! It calculates per-container nutritional breakdowns effortlessly.' }],
    relatedTools: ['food-nutrition-calculator', 'meal-planner'],
    component: RecipeNutritionEstimator
  },
  {
    id: 'calorie-deficit-calculator',
    name: 'Calorie Deficit Calculator',
    shortDescription: 'Calculate safe weight loss timelines and daily calorie targets based on your deficit.',
    category: 'health',
    iconName: 'Flame',
    keywords: ['calorie deficit', 'weight loss calculator', 'fat loss timeline', 'deficit projection'],
    instructions: ['Enter maintenance TDEE, weight loss goal in kg, and chosen daily deficit in kcal.'],
    faqs: [{ question: 'How many calories are in 1 kg of body fat?', answer: 'Approximately 7,700 kcal (or roughly 3,500 kcal per pound of fat).' }],
    relatedTools: ['calorie-surplus-calculator', 'tdee-calculator'],
    component: CalorieDeficitCalculator
  },
  {
    id: 'calorie-surplus-calculator',
    name: 'Calorie Surplus Calculator',
    shortDescription: 'Plan a lean bulking caloric surplus to optimize muscle hypertrophy while minimizing fat gain.',
    category: 'health',
    iconName: 'Flame',
    keywords: ['calorie surplus', 'bulking calculator', 'muscle gain', 'hypertrophy calories'],
    instructions: ['Enter maintenance calories and desired daily surplus (+200 to +500 kcal).'],
    faqs: [{ question: 'What is a lean surplus?', answer: 'A modest surplus of 200-300 kcal/day supports muscle synthesis without excessive fat accumulation.' }],
    relatedTools: ['calorie-deficit-calculator', 'one-rep-max-calculator'],
    component: CalorieSurplusCalculator
  },
  {
    id: 'sugar-intake-tracker',
    name: 'Sugar Intake Tracker',
    shortDescription: 'Monitor daily added sugar intake in grams against World Health Organization (WHO) guidelines.',
    category: 'health',
    iconName: 'AlertCircle',
    keywords: ['sugar tracker', 'free sugars', 'who sugar limit', 'added sugar'],
    instructions: ['Input grams of added sugar consumed throughout the day.'],
    faqs: [{ question: 'What is the WHO recommendation for added sugar?', answer: 'Less than 10% of total energy intake, with additional benefits below 5% (approx. 25g/day).' }],
    relatedTools: ['fiber-intake-tracker', 'food-label-analyzer'],
    component: SugarIntakeTracker
  },
  {
    id: 'fiber-intake-tracker',
    name: 'Fiber Intake Tracker',
    shortDescription: 'Track dietary fiber consumption against recommended daily allowances (25g women, 38g men).',
    category: 'health',
    iconName: 'Apple',
    keywords: ['fiber tracker', 'dietary fiber', 'digestive health', 'rda fiber'],
    instructions: ['Log grams of dietary fiber from legumes, vegetables, fruits, and whole grains.'],
    faqs: [{ question: 'Why is fiber essential?', answer: 'Dietary fiber regulates blood sugar, reduces LDL cholesterol, and nourishes the gut microbiome.' }],
    relatedTools: ['sugar-intake-tracker', 'food-label-analyzer'],
    component: FiberIntakeTracker
  },
  {
    id: 'food-label-analyzer',
    name: 'Food Label Analyzer (% Daily Value)',
    shortDescription: 'Analyze Nutrition Facts food labels to quickly identify high sodium, saturated fat, or added sugars.',
    category: 'health',
    iconName: 'FileText',
    keywords: ['food label', 'nutrition facts', 'daily value', 'fda label analyzer'],
    instructions: ['Enter calories, sodium, saturated fat, and sugar from any packaged food label.'],
    faqs: [{ question: 'What is the 5/20 rule on food labels?', answer: '5% Daily Value or less is low in that nutrient; 20% Daily Value or more is high.' }],
    relatedTools: ['sugar-intake-tracker', 'fiber-intake-tracker'],
    component: FoodLabelAnalyzer
  },
  {
    id: 'meal-calorie-split-calculator',
    name: 'Meal Calorie Split Calculator',
    shortDescription: 'Distribute your daily calorie allowance evenly or strategically across 3 to 5 meals per day.',
    category: 'health',
    iconName: 'PieChart',
    keywords: ['meal split', 'calorie distribution', 'meal timing', 'breakfast calories'],
    instructions: ['Enter daily calorie goal and select your preferred meal frequency.'],
    faqs: [{ question: 'Does meal frequency affect metabolism?', answer: 'Total daily calories and macronutrient quality are far more impactful than meal frequency.' }],
    relatedTools: ['calorie-tracker', 'meal-planner'],
    component: MealCalorieSplitCalculator
  },
  {
    id: 'daily-nutrition-summary',
    name: 'Daily Nutrition Summary',
    shortDescription: 'High-level synthesis of daily calories, macros, hydration, fiber, and sugar benchmarks.',
    category: 'health',
    iconName: 'Activity',
    keywords: ['nutrition summary', 'diet scorecard', 'daily macros summary'],
    instructions: ['Review integrated daily scorecard of your nutritional intake.'],
    faqs: [{ question: 'Is this data backed up?', answer: 'Yes, all nutrition data connects with LifeTools Universal Backup & Restore.' }],
    relatedTools: ['calorie-tracker', 'daily-food-diary'],
    component: DailyNutritionSummary
  },

  // ==========================================
  // 4. Sleep & Wellness Tools (15 Tools)
  // ==========================================
  {
    id: 'sleep-calculator',
    name: 'Sleep Cycle Calculator',
    shortDescription: 'Calculate optimal bedtimes based on 90-minute REM sleep cycles to avoid waking during deep sleep.',
    category: 'health',
    iconName: 'Moon',
    keywords: ['sleep calculator', 'sleep cycles', 'rem sleep', 'optimal bedtime'],
    isPopular: true,
    instructions: ['Set your desired wake-up time.', 'View calculated bedtimes that align with natural 90-minute sleep cycle completions.'],
    faqs: [{ question: 'What happens if I wake up mid-cycle?', answer: 'Waking during deep Slow Wave Sleep (N3) causes sleep inertia, leaving you feeling tired and groggy.' }],
    relatedTools: ['wake-up-time-calculator', 'sleep-tracker'],
    component: SleepCalculator
  },
  {
    id: 'sleep-tracker',
    name: 'Sleep Duration & Quality Tracker',
    shortDescription: 'Log sleep and wake times, total sleep duration, and subjective quality ratings locally in IndexedDB.',
    category: 'health',
    iconName: 'Moon',
    keywords: ['sleep tracker', 'sleep log', 'hours slept', 'sleep quality'],
    instructions: ['Log bedtime, wake time, and sleep quality (1-5 stars).', 'Review historical logs saved in your browser.'],
    faqs: [{ question: 'Is my sleep data shared?', answer: 'Never. All sleep logs are strictly stored locally in your browser IndexedDB.' }],
    relatedTools: ['sleep-calculator', 'sleep-cycle-planner'],
    component: SleepTracker
  },
  {
    id: 'sleep-cycle-planner',
    name: 'Sleep Schedule Optimizer & REM Planner',
    shortDescription: 'Educational guide and schedule optimizer for Non-REM (N1, N2, N3) and REM sleep architecture.',
    category: 'health',
    iconName: 'Clock',
    keywords: ['sleep architecture', 'rem planner', 'sleep stages', 'deep sleep'],
    instructions: ['Learn sleep stage proportions and plan consistent circadian sleep windows.'],
    faqs: [{ question: 'Why is sleep consistency important?', answer: 'Keeping a consistent wake time anchors your circadian rhythm, improving sleep onset latency.' }],
    relatedTools: ['sleep-calculator', 'bedtime-calculator'],
    component: SleepCyclePlanner
  },
  {
    id: 'bedtime-calculator',
    name: 'Bedtime Calculator',
    shortDescription: 'Calculate the exact time you should fall asleep to wake up refreshed for your alarm.',
    category: 'health',
    iconName: 'Moon',
    keywords: ['bedtime calculator', 'bedtime schedule', 'when to sleep'],
    instructions: ['Input your alarm time and choose between 5 or 6 complete sleep cycles.'],
    faqs: [{ question: 'How much time is added for falling asleep?', answer: 'The calculator factors in 14 minutes of average sleep latency.' }],
    relatedTools: ['sleep-calculator', 'wake-up-time-calculator'],
    component: BedtimeCalculator
  },
  {
    id: 'wake-up-time-calculator',
    name: 'Wake-up Time Calculator',
    shortDescription: 'Calculate optimal wake times if you go to sleep right now based on 90-minute cycle multiples.',
    category: 'health',
    iconName: 'Sun',
    keywords: ['wake up time', 'sleep now', 'when to wake up'],
    instructions: ['Check suggested wake times if going to sleep at the current minute.'],
    faqs: [{ question: 'Are 7.5 hours of sleep optimal?', answer: 'Yes! 5 full cycles (7.5 hours) is the sweet spot for the vast majority of healthy adults.' }],
    relatedTools: ['sleep-calculator', 'bedtime-calculator'],
    component: WakeUpTimeCalculator
  },
  {
    id: 'relaxation-timer',
    name: 'Relaxation Timer',
    shortDescription: 'Gentle countdown timer with calming audio bell designed for rest, unguided quiet, or naps.',
    category: 'health',
    iconName: 'Clock',
    keywords: ['relaxation timer', 'nap timer', 'power nap', 'rest timer'],
    instructions: ['Select duration (3m to 15m) and enjoy a quiet pause with a soft finish chime.'],
    faqs: [{ question: 'What is a power nap length?', answer: 'A 20-minute power nap boosts alertness without letting you enter groggy deep sleep.' }],
    relatedTools: ['meditation-timer', 'breathing-exercise-timer'],
    component: RelaxationTimer
  },
  {
    id: 'meditation-timer',
    name: 'Mindfulness Meditation Timer',
    shortDescription: 'Minimalist meditation timer with warm 528Hz Solfeggio frequency finish bell for daily practice.',
    category: 'health',
    iconName: 'Sparkles',
    keywords: ['meditation timer', 'mindfulness', 'zen timer', 'vipassana'],
    instructions: ['Choose meditation duration and sit comfortably in a quiet space.'],
    faqs: [{ question: 'What sound is used for the bell?', answer: 'A pure synthesized harmonic chime generated locally via the Web Audio API.' }],
    relatedTools: ['relaxation-timer', 'breathing-exercise-timer'],
    component: MeditationTimer
  },
  {
    id: 'breathing-exercise-timer',
    name: 'Breathing Exercise Timer (Box & 4-7-8)',
    shortDescription: 'Animated visual breathing guide supporting Box Breathing (4-4-4-4) and 4-7-8 deep relaxation.',
    category: 'health',
    iconName: 'Heart',
    keywords: ['breathing timer', 'box breathing', '4-7-8 breathing', 'pranayama', 'calm breath'],
    isPopular: true,
    instructions: ['Select Box Breathing (for focus) or 4-7-8 (for sleep relaxation) and match your breath to the expanding circle.'],
    faqs: [{ question: 'What is Box Breathing?', answer: 'Used by athletes and first responders: Inhale 4s, Hold 4s, Exhale 4s, Hold 4s to regulate autonomic nerves.' }],
    relatedTools: ['meditation-timer', 'stress-journal'],
    component: BreathingExerciseTimer
  },
  {
    id: 'mood-tracker',
    name: 'Mood & Emotional Wellbeing Tracker',
    shortDescription: 'Track daily emotional states and subjective mood ratings on a 5-point spectrum.',
    category: 'health',
    iconName: 'Smile',
    keywords: ['mood tracker', 'emotional health', 'mental wellbeing', 'mood journal'],
    instructions: ['Select your current mood from Very Low to Excellent.'],
    faqs: [{ question: 'Does this diagnose depression?', answer: 'No. This is a personal reflection tool. Consult mental health professionals for psychological support.' }],
    relatedTools: ['daily-wellness-journal', 'stress-journal'],
    component: MoodTracker
  },
  {
    id: 'daily-wellness-journal',
    name: 'Daily Wellness Journal',
    shortDescription: 'Private daily scratchpad for gratitude lists, personal wins, and self-reflection notes.',
    category: 'health',
    iconName: 'FileText',
    keywords: ['wellness journal', 'gratitude journal', 'daily reflections', 'mindfulness journal'],
    instructions: ['Write 2-3 things you are grateful for and record today’s personal achievements.'],
    faqs: [{ question: 'Are journal entries confidential?', answer: '100% private. Data stays in your browser with zero remote transmission.' }],
    relatedTools: ['mood-tracker', 'stress-journal'],
    component: DailyWellnessJournal
  },
  {
    id: 'wellness-habit-tracker',
    name: 'Daily Wellness Habit Tracker',
    shortDescription: 'Track foundational daily wellbeing habits: morning sunlight, movement, hydration, and sleep prep.',
    category: 'health',
    iconName: 'CheckCircle2',
    keywords: ['wellness habits', 'healthy habits', 'morning routine', 'habit checklist'],
    instructions: ['Check off completed wellness habits throughout your day.'],
    faqs: [{ question: 'What are foundational health habits?', answer: 'Adequate hydration, morning light exposure, regular movement, and consistent sleep schedules.' }],
    relatedTools: ['daily-self-care-checklist', 'weekly-wellness-summary'],
    component: WellnessHabitTracker
  },
  {
    id: 'stress-journal',
    name: 'Stress & Anxiety Journal',
    shortDescription: 'Identify stressful triggers, physical sensations, and coping strategies in a secure private journal.',
    category: 'health',
    iconName: 'ShieldAlert',
    keywords: ['stress journal', 'anxiety log', 'stress triggers', 'coping mechanisms'],
    instructions: ['Rate your stress level (1-5) and log specific events or thoughts triggering tension.'],
    faqs: [{ question: 'How does journaling relieve stress?', answer: 'Labeling emotions and externalizing stressors on paper or screen helps downregulate amygdala reactivity.' }],
    relatedTools: ['breathing-exercise-timer', 'daily-wellness-journal'],
    component: StressJournal
  },
  {
    id: 'screen-time-tracker',
    name: 'Screen Time & Digital Wellness Logger',
    shortDescription: 'Log work and recreational screen hours and apply the 20-20-20 rule to reduce digital eye strain.',
    category: 'health',
    iconName: 'Activity',
    keywords: ['screen time', 'digital wellness', 'eye strain', '20-20-20 rule'],
    instructions: ['Enter estimated daily work and recreational screen hours.'],
    faqs: [{ question: 'What is the 20-20-20 rule?', answer: 'Every 20 minutes, look at an object 20 feet away for at least 20 seconds to relax ciliary eye muscles.' }],
    relatedTools: ['relaxation-timer', 'daily-self-care-checklist'],
    component: ScreenTimeTracker
  },
  {
    id: 'daily-self-care-checklist',
    name: 'Daily Self-Care Checklist',
    shortDescription: 'Holistic daily checklist covering physical, mental, emotional, and social self-care activities.',
    category: 'health',
    iconName: 'CheckCircle2',
    keywords: ['self care', 'self care checklist', 'mental health check', 'personal care'],
    instructions: ['Check off simple daily self-care actions across physical and emotional pillars.'],
    faqs: [{ question: 'How does self-care prevent burnout?', answer: 'Consistent small restorative actions protect cognitive stamina and resilience over time.' }],
    relatedTools: ['wellness-habit-tracker', 'weekly-wellness-summary'],
    component: DailySelfCareChecklist
  },
  {
    id: 'weekly-wellness-summary',
    name: 'Weekly Wellness Summary',
    shortDescription: '7-day overview synthesizing average sleep, workout days, mood scores, and hydration consistency.',
    category: 'health',
    iconName: 'Activity',
    keywords: ['weekly wellness', 'health synthesis', '7 day review', 'wellness review'],
    instructions: ['Review overall 7-day health habits and adherence.'],
    faqs: [{ question: 'Can I export this summary?', answer: 'Yes, full health data is exportable in JSON and CSV via Backup & Restore.' }],
    relatedTools: ['daily-wellness-journal', 'wellness-habit-tracker'],
    component: WeeklyWellnessSummary
  },

  // ==========================================
  // 5. Personal Health Records (10 Tools)
  // ==========================================
  {
    id: 'personal-health-journal',
    name: 'Personal Health Journal',
    shortDescription: 'Chronological log of personal symptoms, energy fluctuations, and health events stored in IndexedDB.',
    category: 'health',
    iconName: 'FileText',
    keywords: ['health journal', 'symptom log', 'health diary', 'medical notes'],
    isPopular: true,
    instructions: ['Record date, title, and detailed health notes.', 'All records remain 100% on your local device.'],
    faqs: [{ question: 'Can my doctor see this?', answer: 'You can export or copy entries to share directly during medical appointments.' }],
    relatedTools: ['health-notes', 'medical-report-organizer'],
    component: PersonalHealthJournal
  },
  {
    id: 'medication-reminder',
    name: 'Personal Medication Schedule',
    shortDescription: 'Log and track personal medication schedules, dosages, frequencies, and prescription notes locally.',
    category: 'health',
    iconName: 'Pill',
    keywords: ['medication schedule', 'pill reminder', 'prescriptions', 'dosage log'],
    instructions: ['Enter medication name, dosage, and frequency instructions.', 'Maintain an offline list of current medications.'],
    faqs: [{ question: 'Does this app verify drug interactions?', answer: 'No! This is an offline personal organizer. Consult your physician or pharmacist regarding drug safety.' }],
    relatedTools: ['appointment-reminder', 'emergency-medical-card'],
    component: MedicationReminder
  },
  {
    id: 'appointment-reminder',
    name: 'Medical & Dental Appointment Tracker',
    shortDescription: 'Keep track of upcoming physician visits, dentist cleanings, specialist dates, and clinic locations.',
    category: 'health',
    iconName: 'Calendar',
    keywords: ['doctor appointment', 'dentist reminder', 'clinic visit', 'appointment tracker'],
    instructions: ['Log doctor name, medical specialty, date, and time.'],
    faqs: [{ question: 'Is appointment data backed up?', answer: 'Yes, fully included in LifeTools Universal Backup & Restore.' }],
    relatedTools: ['medication-reminder', 'health-notes'],
    component: AppointmentReminderTool
  },
  {
    id: 'medical-report-organizer',
    name: 'Medical Report & Lab Results Organizer',
    shortDescription: 'Organize blood work, lipid panels, imaging notes, and lab test results by category and date.',
    category: 'health',
    iconName: 'FileText',
    keywords: ['medical reports', 'lab results', 'blood test log', 'xray records'],
    instructions: ['Log report title, category (Blood, Radiology, Cardiac), and key clinical values.'],
    faqs: [{ question: 'Can I store lab values securely?', answer: 'Yes, entries are stored in your private local browser database.' }],
    relatedTools: ['personal-health-journal', 'health-notes'],
    component: MedicalReportOrganizer
  },
  {
    id: 'blood-pressure-log',
    name: 'Blood Pressure Tracker & Log',
    shortDescription: 'Record systolic and diastolic blood pressure with American Heart Association (AHA) category classification.',
    category: 'health',
    iconName: 'HeartPulse',
    keywords: ['blood pressure', 'bp log', 'systolic diastolic', 'hypertension', 'aha guidelines'],
    isPopular: true,
    instructions: ['Enter systolic, diastolic, and pulse.', 'Review AHA category (Normal, Elevated, Stage 1, Stage 2) and log history.'],
    faqs: [{ question: 'What is normal blood pressure?', answer: 'AHA defines normal blood pressure as systolic under 120 mmHg and diastolic under 80 mmHg.' }],
    relatedTools: ['blood-sugar-log', 'heart-rate-zone-calculator'],
    component: BloodPressureLogTool
  },
  {
    id: 'blood-sugar-log',
    name: 'Blood Sugar / Glucose Log',
    shortDescription: 'Log fasting and post-prandial blood glucose in mg/dL or mmol/L with American Diabetes Association ranges.',
    category: 'health',
    iconName: 'Activity',
    keywords: ['blood sugar', 'glucose log', 'fasting glucose', 'diabetes tracking', 'ada ranges'],
    instructions: ['Enter glucose reading, select unit (mg/dL or mmol/L), and timing (fasting, post-meal).'],
    faqs: [{ question: 'What is normal fasting blood sugar?', answer: 'ADA considers fasting plasma glucose under 100 mg/dL normal; 100-125 mg/dL indicates prediabetes.' }],
    relatedTools: ['blood-pressure-log', 'weight-history-tracker'],
    component: BloodSugarLogTool
  },
  {
    id: 'weight-history-tracker',
    name: 'Weight History & Trend Tracker',
    shortDescription: 'Track body weight weigh-ins over time with date-stamped logging and moving average history.',
    category: 'health',
    iconName: 'Scale',
    keywords: ['weight history', 'weigh in tracker', 'scale log', 'body weight trend'],
    instructions: ['Log body weight in kg or lbs regularly.'],
    faqs: [{ question: 'How often should I weigh myself?', answer: 'Weighing once daily under identical conditions (morning after restroom) provides the cleanest trend.' }],
    relatedTools: ['body-measurements-tracker', 'body-mass-index-calculator'],
    component: WeightHistoryTracker
  },
  {
    id: 'body-measurements-tracker',
    name: 'Body Measurements Tracker',
    shortDescription: 'Track circumference changes across chest, waist, hips, biceps, and thighs over time.',
    category: 'health',
    iconName: 'Scale',
    keywords: ['body measurements', 'tape measurements', 'chest waist hips', 'circumference log'],
    instructions: ['Record measurements in cm or inches to monitor body recomposition.'],
    faqs: [{ question: 'Why track measurements instead of just weight?', answer: 'Body recomposition often builds muscle while burning fat, causing the scale to stay flat while inches drop.' }],
    relatedTools: ['weight-history-tracker', 'body-fat-percentage-estimator'],
    component: BodyMeasurementsTracker
  },
  {
    id: 'health-notes',
    name: 'Doctor Consultation & Health Notes',
    shortDescription: 'Prepare lists of questions before seeing your doctor and note clinical care instructions.',
    category: 'health',
    iconName: 'FileText',
    keywords: ['doctor questions', 'consultation notes', 'medical questions', 'health notes'],
    instructions: ['Jot down symptoms and questions before visiting your physician.'],
    faqs: [{ question: 'Why write questions beforehand?', answer: 'Patients frequently forget key symptoms or medication questions during brief clinical visits.' }],
    relatedTools: ['appointment-reminder', 'personal-health-journal'],
    component: HealthNotesTool
  },
  {
    id: 'emergency-medical-card',
    name: 'Emergency Medical ID Card Generator',
    shortDescription: 'Generate and print a wallet-sized In Case of Emergency (ICE) card with blood type, allergies, and contacts.',
    category: 'health',
    iconName: 'Heart',
    keywords: ['emergency card', 'ice card', 'medical id', 'blood type', 'allergies wallet card'],
    isPopular: true,
    instructions: ['Fill in your blood type, emergency contact, allergies, and conditions.', 'Save and click Print Wallet Card to print and laminate.'],
    faqs: [{ question: 'What should be on an emergency card?', answer: 'Full name, blood type, primary emergency phone contact, life-threatening allergies, and chronic conditions.' }],
    relatedTools: ['medication-reminder', 'personal-health-journal'],
    component: EmergencyMedicalCardTool
  }
];
