# LifeTools — Health, Fitness & Wellness Suite (`#/categories/health`)

> **Comprehensive Guide to Everyday Health Calculators, Fitness Planners, Nutrition Trackers, Sleep Timers & Private Health Records**  
> *Category 18 • 70 Tools • 100% Client-Side • Zero Cloud Telemetry • Native IndexedDB Persistence*

---

## ⚕️ Important Medical Notice & Clinical Disclaimer

LifeTools Health, Fitness & Wellness utilities are designed strictly for **informational, educational, fitness planning, and personal organization purposes**.

- **No Medical Advice:** Nothing within this platform constitutes clinical medical advice, diagnostic evaluations, medical prognosis, or treatment recommendations.
- **Consult Healthcare Professionals:** Always consult a licensed physician, registered dietitian, or certified health specialist before initiating new diets, intense workout regimens, or altering medication schedules.
- **Emergency Situations:** In case of a medical emergency, immediately contact your local emergency services (911, 112, 999) or proceed to the nearest hospital emergency room.

---

## 🔒 100% Client-Side Privacy & Storage Architecture

Sensitive personal health metrics (such as blood pressure readings, blood glucose logs, prescription medications, body measurements, and physician appointments) require the highest level of confidentiality.

1. **Zero External Servers:** LifeTools never transmits your biometrics, health journal entries, or medication schedules to any cloud server or API endpoint.
2. **Local IndexedDB Engine (`lifetools_health_db`):** Data is persisted exclusively within your browser's sandboxed IndexedDB storage with an automated in-memory fallback.
3. **Universal Backup & Restore Integration:** All health records can be exported to JSON, packaged into encrypted ZIP containers (AES-256-GCM with PBKDF2), or restored with merge/replace conflict resolution.
4. **No Account Required:** Access every tool without registration, email submission, or biometric cookies.

---

## 🧭 Complete Catalog of 70 Health & Wellness Tools

### Section 1: Scientific Health Calculators (15 Tools)

| Tool Name | Tool ID | Scientific Basis & Clinical Reference | Key Features |
| :--- | :--- | :--- | :--- |
| **BMI Calculator** | `body-mass-index-calculator` | WHO Cutoffs & Asian Pacific Guidelines ($\text{BMI} = \frac{\text{kg}}{\text{m}^2}$) | Calculates BMI, BMI Prime, Ponderal Index, Asian threshold risk, and healthy target weight range. Metric & Imperial support. |
| **Ideal Weight Estimator** | `ideal-weight-estimator` | Devine (1974), Robinson (1983), Miller (1983), Hamwi (1964) | Computes four clinical ideal body weight standards for adult males and females based on height. |
| **BMR Calculator** | `bmr-calculator` | Mifflin-St Jeor & Revised Harris-Benedict (1984) | Determines basal metabolic rate at complete rest, with optional Katch-McArdle lean mass calculation. |
| **TDEE Calculator** | `tdee-calculator` | Total Daily Energy Expenditure ($\text{BMR} \times \text{PAL}$) | Evaluates daily maintenance calories based on 5 standardized physical activity levels. |
| **Body Fat Percentage Estimator** | `body-fat-percentage-estimator` | US Navy Circumference Method (Hodgdon & Beckett) | Estimates body fat %, fat mass, and lean mass using waist, neck, and hip tape measurements. |
| **Waist-to-Height Ratio** | `waist-to-height-ratio-calculator` | WHtR Cardiometabolic Screening Ratio | Fast screening tool for visceral abdominal adiposity; categorizes healthy vs increased health risk. |
| **Waist-to-Hip Ratio** | `waist-to-hip-ratio-calculator` | WHO Body Shape & Fat Distribution Standard | Evaluates apple vs pear body fat distribution; identifies cardiovascular disease risk thresholds. |
| **Calorie Needs Calculator** | `calorie-needs-calculator` | Energy Balance & Macronutrient Goal Scaling | Generates daily targets for maintenance, mild deficit ($-250$), standard fat loss ($-500$), and lean bulking ($+250$). |
| **Water Intake Estimator** | `water-intake-estimator` | Hydration Standard ($35\text{ ml/kg} + \text{Activity}$) | Daily hydration target in liters and 8oz glasses, adjusted for daily workout duration and ambient climate. |
| **Protein Intake Calculator** | `protein-intake-calculator` | ISSN & RDA Protein Requirements ($0.8 - 2.4\text{ g/kg}$) | Provides daily gram targets customized for sedentary, endurance, muscle hypertrophy, or deficit retention. |
| **Age & Fitness Calculator** | `age-fitness-calculator` | Physiological Fitness Age Estimation | Compares chronological age against aerobic capacity, resting pulse, and body composition. |
| **Pregnancy Due Date Calculator** | `pregnancy-due-date-calculator` | Naegele’s Rule (280-day gestational model) | Estimates due date, conception window, current gestational weeks/days, and trimester from Last Menstrual Period. |
| **Ovulation Date Estimator** | `ovulation-date-estimator` | Standard Luteal Phase Window Analysis | Identifies fertile window, peak ovulation day, and upcoming cycle dates based on cycle regularity. |
| **Heart Rate Zone Calculator** | `heart-rate-zone-calculator` | Tanaka Formula ($208 - 0.7 \times \text{Age}$) & Karvonen Reserve | Computes 5 cardiovascular training zones: Active Recovery, Aerobic Fat Burn, Tempo, Threshold, and Maximum. |
| **Target Heart Rate Calculator** | `target-heart-rate-calculator` | Karvonen Heart Rate Reserve ($\text{HRR}$) Formula | Calculates specific target beats-per-minute for aerobic training intensity percentages ($50\% - 85\%$). |

---

### Section 2: Fitness & Workout Tools (15 Tools)

| Tool Name | Tool ID | Description & Capabilities |
| :--- | :--- | :--- |
| **Workout Planner** | `workout-planner` | Custom routine builder: plan exercises, sets, reps, and target rest intervals with persistent local storage. |
| **Daily Exercise Tracker** | `daily-exercise-tracker` | Log daily workout duration, activity type, perceived exertion rating (RPE 1-10), and review workout history. |
| **Push-up Counter** | `push-up-counter` | Interactive tap-to-count training tool with target rep goals, set completion audio beeps, and session summaries. |
| **Squat Counter** | `squat-counter` | Tap counter for bodyweight or weighted squats with target tracking and audio chime feedback. |
| **Plank Timer** | `plank-timer` | Dedicated core isometric timer with interval sound alerts, start/pause controls, and personal record tracking. |
| **Running Pace Calculator** | `running-pace-calculator` | Calculates split pace ($\text{min/km}$ and $\text{min/mile}$) and running speed ($\text{km/h}$ and $\text{mph}$) from distance and elapsed time. |
| **Running Distance Calculator** | `running-distance-calculator` | Estimates completed running distance given a target pace and total elapsed running time. |
| **Walking Pace Calculator** | `walking-pace-calculator` | Evaluates walking cadence (steps per minute), average walking speed, and brisk pace classification. |
| **Steps-to-Distance Calculator** | `steps-to-distance-calculator` | Converts daily pedometer steps into exact kilometers and miles based on individual stride length and height. |
| **Exercise Calorie Estimator** | `exercise-calorie-estimator` | Calculates energy expenditure ($\text{kcal}$) using the Compendium of Physical Activities METs index across 22 activities. |
| **One Rep Max Calculator** | `one-rep-max-calculator` | Computes 1RM using Brzycki, Epley, Lander, and Lombardi formulas; provides full $50\% - 95\%$ training weight tables. |
| **Workout Rest Timer** | `workout-rest-timer` | Audible countdown timer for gym rest periods with quick-select buttons ($30\text{s}, 60\text{s}, 90\text{s}, 120\text{s}, 180\text{s}$). |
| **Interval Training Timer** | `interval-training-timer` | HIIT / Tabata circuit timer: configure work duration, rest intervals, and total rounds with distinct audio cues. |
| **Fitness Goal Tracker** | `fitness-goal-tracker` | Set and monitor measurable fitness milestones (e.g. running 5K, lifting bodyweight, daily 10K steps). |
| **Weekly Workout Schedule** | `weekly-workout-schedule` | Interactive 7-day training calendar to organize push/pull/legs, cardio, and rest days. |

---

### Section 3: Nutrition & Diet Tools (15 Tools)

| Tool Name | Tool ID | Description & Capabilities |
| :--- | :--- | :--- |
| **Calorie Tracker** | `calorie-tracker` | Client-side daily calorie logger with interactive food entry, breakfast/lunch/dinner/snack breakdowns, and target gauges. |
| **Food Nutrition Calculator** | `food-nutrition-calculator` | Calculate calories and macro breakdown for custom food quantities and ingredients. |
| **Macronutrient Calculator** | `macronutrient-calculator` | Scales protein, carbohydrate, and dietary fat ratios according to balanced, low-carb, keto, or high-protein protocols. |
| **Protein Tracker** | `protein-tracker` | Daily protein counter to ensure minimum amino acid targets are met for muscle repair and recovery. |
| **Meal Planner** | `meal-planner` | Weekly meal planning grid with recipe notes, grocery item linking, and dietary tags. |
| **Daily Food Diary** | `daily-food-diary` | Private local food journal: log meals, timestamps, satiety levels, and post-meal digestive symptoms. |
| **Portion Size Converter** | `portion-size-converter` | Scaler tool for recipe serving adjustments and kitchen unit conversions (grams, ounces, cups, tablespoons). |
| **Recipe Nutrition Estimator** | `recipe-nutrition-estimator` | Sums total ingredients to calculate per-serving caloric density and nutritional facts. |
| **Calorie Deficit Calculator** | `calorie-deficit-calculator` | Projects safe rate of weekly fat loss ($-0.25\text{ kg}$ to $-1.0\text{ kg}$) based on deficit depth and timeline. |
| **Calorie Surplus Calculator** | `calorie-surplus-calculator` | Estimates lean muscle gain versus fat accumulation rates for athletic bulking cycles. |
| **Sugar Intake Tracker** | `sugar-intake-tracker` | Monitors added sugar consumption against AHA recommendations ($<25\text{g}$ for women, $<36\text{g}$ for men). |
| **Fiber Intake Tracker** | `fiber-intake-tracker` | Tracks daily dietary soluble and insoluble fiber intake toward the recommended $25 - 38\text{ g/day}$ goal. |
| **Food Label Analyzer** | `food-label-analyzer` | Decodes packaged food nutrition labels: identifies sugar spikes, sodium thresholds, and trans fat indicators. |
| **Meal Calorie Split Calculator** | `meal-calorie-split-calculator` | Distributes daily calorie targets across breakfast ($25\%$), lunch ($35\%$), dinner ($30\%$), and snacks ($10\%$). |
| **Daily Nutrition Summary** | `daily-nutrition-summary` | Aggregates daily nutritional intake into clear visual progress bars with persistent historical logging. |

---

### Section 4: Sleep & Wellness Tools (15 Tools)

| Tool Name | Tool ID | Description & Capabilities |
| :--- | :--- | :--- |
| **Sleep Calculator** | `sleep-calculator` | Calculates optimal bedtimes based on 90-minute REM sleep cycles and a 14-minute average sleep latency. |
| **Sleep Tracker** | `sleep-tracker` | Log sleep duration, bedtimes, wake-up times, and subjective sleep quality scores ($1 - 5$). |
| **Sleep Schedule Planner** | `sleep-cycle-planner` | Plan consistent sleep schedules and wake-up times to optimize circadian rhythm alignment. |
| **Bedtime Calculator** | `bedtime-calculator` | Computes reverse bedtimes to ensure waking up between sleep cycles rather than during deep slow-wave sleep. |
| **Wake-up Time Calculator** | `wake-up-time-calculator` | Computes wake-up times if going to bed right now, highlighting optimal 5-cycle ($7.5\text{h}$) and 6-cycle ($9.0\text{h}$) targets. |
| **Relaxation Timer** | `relaxation-timer` | Calming ambient audio timer with soft acoustic chimes for unwinding before sleep. |
| **Meditation Timer** | `meditation-timer` | Zen mindfulness timer with interval gongs, warm-up preparation countdown, and session logging. |
| **Breathing Exercise Timer** | `breathing-exercise-timer` | Animated visual breathing pacer supporting Box Breathing ($4-4-4-4$) and Relaxing Sleep Breathing ($4-7-8$). |
| **Mood Tracker** | `mood-tracker` | Daily emotional check-in with mood scales, contextual factors (work, family, sleep, exercise), and notes. |
| **Daily Wellness Journal** | `daily-wellness-journal` | Private gratitude and wellness journaling tool with daily prompts and searchable local history. |
| **Habit Tracker** | `wellness-habit-tracker` | Track wellness habits (morning sunlight, 10-minute walk, no screens before bed, hydration) with streak counters. |
| **Stress Journal** | `stress-journal` | Private emotional decompression log: track stress triggers, intensity ratings ($1-10$), and coping strategies. |
| **Screen Time Tracker** | `screen-time-tracker` | Log and monitor daily recreational and productive screen hours to protect sleep hygiene and eye comfort. |
| **Daily Self-Care Checklist** | `daily-self-care-checklist` | Practical daily mental health hygiene checklist (hydration, movement, outdoors, social connection, relaxation). |
| **Weekly Wellness Summary** | `weekly-wellness-summary` | High-level weekly dashboard summarizing exercise minutes, sleep consistency, mood trends, and self-care completion. |

---

### Section 5: Personal Health Records (10 Tools)

| Tool Name | Tool ID | Description & Capabilities |
| :--- | :--- | :--- |
| **Personal Health Journal** | `personal-health-journal` | Comprehensive timeline for symptoms, health observations, vitality ratings, and physician consultation notes. |
| **Medication Reminder** | `medication-reminder` | Track active prescriptions, dosages, intake frequencies, timing schedules, and specific food instructions. |
| **Appointment Reminder** | `appointment-reminder` | Manage upcoming doctor visits, clinical specialists, consultation dates, clinic locations, and prep notes. |
| **Medical Report Organizer** | `medical-report-organizer` | Categorize and organize lab test dates, radiology results, blood work summaries, and key physician findings. |
| **Blood Pressure Log** | `blood-pressure-log` | Log systolic, diastolic, and pulse readings; automatically classifies each reading using AHA/ACC clinical stages. |
| **Blood Sugar Log** | `blood-sugar-log` | Log glucose levels ($\text{mg/dL}$ or $\text{mmol/L}$) with fasting, pre-meal, and post-meal ADA target classifications. |
| **Weight History Tracker** | `weight-history-tracker` | Track body weight changes over time with date stamping, trend calculations, and progress milestones. |
| **Body Measurements Tracker** | `body-measurements-tracker` | Log circumference measurements (chest, waist, hips, biceps, thighs, neck) to monitor physical progress. |
| **Health Notes** | `health-notes` | Private notebook for questions to ask your doctor, vaccination history, allergies, and family health history. |
| **Emergency Medical Card** | `emergency-medical-card` | Generate and print a standard wallet-sized Emergency ICE (In Case of Emergency) medical profile card. |

---

## 🖨️ Emergency Medical ICE Card Printing

The **Emergency Medical Information Card** tool (`emergency-medical-card`) includes browser-native `@media print` vector styling. When printed or exported to PDF, it produces a clean, credit-card sized foldout containing:

- Full Name & Date of Birth
- Blood Group (A+, A-, B+, B-, AB+, AB-, O+, O-)
- Primary & Secondary Emergency Contacts (Name, Phone, Relationship)
- Known Allergies & Medication Sensitivities
- Chronic Medical Conditions
- Current Daily Prescriptions
- Organ Donor Designation
- Preferred Hospital & Insurance Policy Details

---

## 💾 IndexedDB Data Storage Schema (`lifetools_health_db`)

All personal health records are stored inside a dedicated local database:

```
Database: lifetools_health_db (Version 1)
Object Stores:
├── blood_pressure_logs  (keyPath: 'id', index: 'by_date')
├── blood_sugar_logs     (keyPath: 'id', index: 'by_date')
├── medications          (keyPath: 'id', index: 'by_active')
├── appointments         (keyPath: 'id', index: 'by_date')
├── medical_reports      (keyPath: 'id', index: 'by_date')
├── health_journal       (keyPath: 'id', index: 'by_date')
├── health_notes         (keyPath: 'id', index: 'by_category')
├── weight_logs          (keyPath: 'id', index: 'by_date')
├── body_measurements    (keyPath: 'id', index: 'by_date')
├── emergency_cards      (keyPath: 'id')
├── workout_logs         (keyPath: 'id', index: 'by_date')
├── food_logs            (keyPath: 'id', index: 'by_date')
├── sleep_logs           (keyPath: 'id', index: 'by_date')
├── mood_logs            (keyPath: 'id', index: 'by_date')
└── wellness_habits      (keyPath: 'id')
```

---

*LifeTools is built with care for everyday people, ensuring uncompromising privacy and high-precision utilities.*
