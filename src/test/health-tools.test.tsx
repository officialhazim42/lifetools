import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  calculateBmi,
  calculateIdealWeight,
  calculateBmr,
  calculateTdee,
  calculateBodyFat,
  calculateWhtr,
  calculateWhr,
  calculateWaterIntake,
  calculateProteinNeeds,
  calculatePregnancyDueDate,
  calculateOvulationWindow,
  calculateHeartRateZones
} from '../utils/health/healthCalculators';
import {
  calculateRunningPace,
  calculateStepsToDistance,
  calculateExerciseCalories,
  calculateOneRepMax
} from '../utils/health/fitnessUtils';
import {
  calculateBedtimesForWakeTime,
  calculateWakeTimesFromNow,
  classifyBloodPressure,
  classifyBloodSugar
} from '../utils/health/sleepUtils';
import { healthDB } from '../utils/healthDB';

// UI Components
import { ToastProvider } from '../context/ToastContext';
import {
  BodyMassIndexCalculator,
  CalorieNeedsCalculator
} from '../components/tools/health/HealthCalculatorTools';
import { PushUpCounter } from '../components/tools/health/FitnessWorkoutTools';
import { SleepCalculator } from '../components/tools/health/SleepWellnessTools';

describe('LifeTools Health, Fitness & Wellness Suite', () => {
  beforeEach(async () => {
    await healthDB.restoreAll({}, 'replace');
  });

  // ==========================================
  // 1. Health Calculators Formula Tests
  // ==========================================
  describe('Health & Body Composition Calculators', () => {
    it('calculates BMI with WHO and Asian classifications accurately', () => {
      // 70 kg, 175 cm -> 70 / (1.75^2) = 22.86 -> 22.9
      const result = calculateBmi(70, 175);
      expect(result).not.toBeNull();
      expect(result!.bmi).toBe(22.9);
      expect(result!.category).toBe('Normal weight');
      expect(result!.asianCategory).toBe('Normal Healthy Range');
      expect(result!.healthyWeightRangeKg[0]).toBeCloseTo(56.7, 1);
      expect(result!.healthyWeightRangeKg[1]).toBeCloseTo(76.3, 1);

      // Overweight check: 85 kg, 175 cm -> BMI 27.76 -> 27.8
      const over = calculateBmi(85, 175);
      expect(over).not.toBeNull();
      expect(over!.bmi).toBe(27.8);
      expect(over!.category).toBe('Overweight');
    });

    it('calculates Ideal Body Weight across 4 established medical formulas', () => {
      const ibwMale = calculateIdealWeight('male', 180);
      expect(ibwMale).not.toBeNull();
      expect(ibwMale!.devineKg).toBeCloseTo(75.1, 0.5);
      expect(ibwMale!.robinsonKg).toBeCloseTo(72.7, 0.5);
      expect(ibwMale!.averageKg).toBeGreaterThan(70);
      expect(ibwMale!.averageKg).toBeLessThan(80);

      const ibwFemale = calculateIdealWeight('female', 165);
      expect(ibwFemale).not.toBeNull();
      expect(ibwFemale!.devineKg).toBeCloseTo(56.9, 0.5);
      expect(ibwFemale!.robinsonKg).toBeCloseTo(57.4, 0.5);
    });

    it('calculates BMR using Mifflin-St Jeor and Harris-Benedict formulas', () => {
      // Male 30y, 75kg, 180cm
      const bmrMale = calculateBmr('male', 30, 75, 180);
      expect(bmrMale).not.toBeNull();
      // Mifflin: 10*75 + 6.25*180 - 5*30 + 5 = 750 + 1125 - 150 + 5 = 1730
      expect(bmrMale!.mifflinStJeor).toBe(1730);
      expect(bmrMale!.harrisBenedict).toBeGreaterThan(1700);

      // Female 28y, 60kg, 165cm
      const bmrFemale = calculateBmr('female', 28, 60, 165);
      expect(bmrFemale).not.toBeNull();
      // Mifflin: 10*60 + 6.25*165 - 5*28 - 161 = 600 + 1031.25 - 140 - 161 = 1330.25 -> 1330
      expect(bmrFemale!.mifflinStJeor).toBe(1330);
    });

    it('calculates TDEE and Goal Calorie adjustments correctly', () => {
      const bmr = 1730;
      const tdeeModerate = calculateTdee(bmr, 'moderate'); // 1730 * 1.55 = 2681.5 -> 2682
      expect(tdeeModerate).toBe(2682);
    });

    it('calculates Body Fat Percentage using US Navy circumference method', () => {
      // Male: height 180, neck 38, waist 85
      const maleBf = calculateBodyFat('male', 180, 85, 38);
      expect(maleBf).not.toBeNull();
      expect(maleBf!.bodyFatPercent).toBeGreaterThan(10);
      expect(maleBf!.bodyFatPercent).toBeLessThan(20);
      expect(maleBf!.category).toBeDefined();

      // Female: height 165, neck 34, waist 72, hip 96
      const femaleBf = calculateBodyFat('female', 165, 72, 34, 96);
      expect(femaleBf).not.toBeNull();
      expect(femaleBf!.bodyFatPercent).toBeGreaterThan(18);
      expect(femaleBf!.bodyFatPercent).toBeLessThan(28);
    });

    it('evaluates Waist-to-Height and Waist-to-Hip ratios', () => {
      const whtr = calculateWhtr(80, 180); // 80 / 180 = 0.444 -> 0.44
      expect(whtr).not.toBeNull();
      expect(whtr!.ratio).toBe(0.44);
      expect(whtr!.category).toBe('Healthy (Low Risk)');

      const whrMale = calculateWhr('male', 85, 95); // 85 / 95 = 0.894 -> 0.89
      expect(whrMale).not.toBeNull();
      expect(whrMale!.ratio).toBe(0.89);
      expect(whrMale!.riskLevel).toBe('Low Risk');

      const whrFemale = calculateWhr('female', 75, 95); // 75 / 95 = 0.789 -> 0.79
      expect(whrFemale).not.toBeNull();
      expect(whrFemale!.ratio).toBe(0.79);
      expect(whrFemale!.riskLevel).toBe('Low Risk');
    });

    it('estimates daily water intake and protein needs accurately', () => {
      const water = calculateWaterIntake(75, 45, 'temperate');
      expect(water.liters).toBeGreaterThan(2.5);
      expect(water.glasses8oz).toBeGreaterThan(10);

      const protein = calculateProteinNeeds(75, 'muscle_gain');
      expect(protein.gramsMin).toBeGreaterThan(100);
      expect(protein.gramsMax).toBeGreaterThanOrEqual(150);
    });

    it('computes Pregnancy Due Date and Ovulation Windows accurately', () => {
      // LMP: 2026-01-01 -> Naegele's rule (+280 days) = 2026-10-08
      const due = calculatePregnancyDueDate('2026-01-01', 28);
      expect(due).not.toBeNull();
      expect(due!.estimatedDueDate).toBe('2026-10-08');
      expect(due!.currentTrimester).toBeGreaterThanOrEqual(1);

      // Cycle 28 days, LMP 2026-05-01 -> Ovulation day 14 (May 15)
      const fert = calculateOvulationWindow('2026-05-01', 28);
      expect(fert).not.toBeNull();
      expect(fert!.ovulationDate).toBe('2026-05-15');
      expect(fert!.fertileWindowStart).toBe('2026-05-10');
      expect(fert!.fertileWindowEnd).toBe('2026-05-16');
    });

    it('calculates Heart Rate Training Zones', () => {
      // Age 30 -> Tanaka Max HR: 208 - (0.7 * 30) = 208 - 21 = 187
      const hrZones = calculateHeartRateZones(30, 60);
      expect(hrZones).not.toBeNull();
      expect(hrZones!.maxHr).toBe(187);
      expect(hrZones!.zones.length).toBe(5);
      expect(hrZones!.zones[0].name).toContain('Active Recovery');
      expect(hrZones!.zones[4].name).toContain('Maximum');
    });
  });

  // ==========================================
  // 2. Fitness & Nutrition Utilities Tests
  // ==========================================
  describe('Fitness & Nutrition Utilities', () => {
    it('calculates running pace and speed correctly', () => {
      // 10 km in 50 minutes (0 hours, 50 mins, 0 secs) -> 5:00 min/km
      const pace = calculateRunningPace(10, 'km', 0, 50, 0);
      expect(pace).not.toBeNull();
      expect(pace!.formattedPaceKm).toBe('5:00 /km');
      expect(pace!.speedKmh).toBe(12);
    });

    it('calculates steps to distance', () => {
      const stepDist = calculateStepsToDistance(10000, 175, 'male');
      expect(stepDist.distanceKm).toBeCloseTo(7.26, 0.5);
      expect(stepDist.distanceMiles).toBeCloseTo(4.51, 0.5);
    });

    it('calculates exercise calories with METs', () => {
      // 70 kg person running 8 km/h (MET 8.3) for 45 minutes
      const burned = calculateExerciseCalories(8.3, 70, 45);
      // 8.3 * 70 * (45 / 60) = 8.3 * 70 * 0.75 = 435.75 -> 436 kcal
      expect(burned).toBe(436);
    });

    it('calculates One Rep Max across standard strength formulas', () => {
      // 100 kg for 5 reps
      const orm = calculateOneRepMax(100, 5);
      expect(orm).not.toBeNull();
      // Brzycki: 100 / (1.0278 - 0.0278 * 5) = 100 / 0.8888 = 112.5 kg
      expect(orm!.brzycki).toBe(112.5);
      // Epley: 100 * (1 + 0.0333 * 5) = 116.65 -> 116.7 kg
      expect(orm!.epley).toBe(116.7);
      expect(orm!.percentageTable.length).toBeGreaterThan(0);
    });

    it('calculates sleep cycles using 90-minute REM intervals', () => {
      const bedtimes = calculateBedtimesForWakeTime('07:00');
      expect(bedtimes).not.toBeNull();
      expect(bedtimes!.cycles.length).toBe(4);
      // 5 cycles = 7.5h + 14 min latency -> 11:16 PM (23:16)
      expect(bedtimes!.cycles.some(c => c.cycleCount === 5)).toBe(true);

      const wakeTimes = calculateWakeTimesFromNow(new Date(2026, 0, 1, 23, 0));
      expect(wakeTimes.wakeTimes.length).toBe(4);
    });

    it('classifies blood pressure according to AHA/ACC guidelines', () => {
      expect(classifyBloodPressure(115, 75).category).toBe('Normal');
      expect(classifyBloodPressure(125, 78).category).toBe('Elevated');
      expect(classifyBloodPressure(135, 85).category).toBe('Hypertension Stage 1');
      expect(classifyBloodPressure(150, 95).category).toBe('Hypertension Stage 2');
      expect(classifyBloodPressure(185, 125).category).toBe('Hypertensive Crisis');
    });

    it('classifies blood glucose according to ADA guidelines', () => {
      expect(classifyBloodSugar(90, 'mg/dL', 'fasting').status).toBe('Normal Fasting Range');
      expect(classifyBloodSugar(115, 'mg/dL', 'fasting').status).toBe('Elevated (Pre-diabetes Indicator)');
      expect(classifyBloodSugar(140, 'mg/dL', 'fasting').status).toBe('High (Diabetes Indicator)');
      expect(classifyBloodSugar(130, 'mg/dL', 'post_meal_2h').status).toBe('Normal Post-Meal Range');
    });
  });

  // ==========================================
  // 3. Health IndexedDB Storage Tests
  // ==========================================
  describe('Health IndexedDB Database', () => {
    it('supports saving, retrieving, and deleting blood pressure logs', async () => {
      await healthDB.saveBpLog({
        id: 'bp-1',
        date: '2026-11-20',
        time: '08:00',
        systolic: 120,
        diastolic: 80,
        pulse: 72,
        category: 'Normal',
        notes: 'Morning check',
        createdAt: new Date().toISOString()
      });

      const all = await healthDB.getBpLogs();
      expect(all.length).toBe(1);
      expect(all[0].systolic).toBe(120);

      await healthDB.deleteBpLog('bp-1');
      const after = await healthDB.getBpLogs();
      expect(after.length).toBe(0);
    });

    it('supports saving, updating, and exporting emergency medical card', async () => {
      await healthDB.saveEmergencyCard({
        id: 'primary_emergency_card',
        fullName: 'Jane Doe',
        dateOfBirth: '1990-05-15',
        bloodType: 'O+',
        allergies: ['Penicillin'],
        chronicConditions: ['Asthma'],
        currentMedications: ['Inhaler'],
        primaryEmergencyContact: {
          name: 'John Doe',
          phone: '+1-555-0199',
          relationship: 'Spouse'
        },
        organDonor: true,
        updatedAt: new Date().toISOString()
      });

      const card = await healthDB.getEmergencyCard();
      expect(card).toBeDefined();
      expect(card?.fullName).toBe('Jane Doe');
      expect(card?.bloodType).toBe('O+');

      const exported = await healthDB.exportAll();
      expect(exported.emergency_card).toBeDefined();
      expect(exported.emergency_card.fullName).toBe('Jane Doe');
    });

    it('supports full export and restore (merge & replace)', async () => {
      await healthDB.saveMedication({
        id: 'med-1',
        name: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        times: ['08:00', '20:00'],
        isActive: true,
        notes: '',
        createdAt: new Date().toISOString()
      });

      await healthDB.saveAppointment({
        id: 'appt-1',
        providerName: 'Dr. Smith',
        specialty: 'Cardiology',
        appointmentDate: '2026-12-01',
        status: 'upcoming',
        notes: '',
        createdAt: new Date().toISOString()
      });

      const statsBefore = await healthDB.getStats();
      expect(statsBefore.medications).toBe(1);
      expect(statsBefore.appointments).toBe(1);

      const exported = await healthDB.exportAll();
      expect(exported.medications.length).toBe(1);
      expect(exported.appointments.length).toBe(1);

      // Wipe with replace
      await healthDB.restoreAll({}, 'replace');
      const statsEmpty = await healthDB.getStats();
      expect(statsEmpty.medications).toBe(0);
      expect(statsEmpty.appointments).toBe(0);

      // Restore back
      await healthDB.restoreAll(exported, 'merge');
      const statsRestored = await healthDB.getStats();
      expect(statsRestored.medications).toBe(1);
      expect(statsRestored.appointments).toBe(1);
    });
  });

  // ==========================================
  // 4. Health UI Component Rendering Tests
  // ==========================================
  describe('Health UI Components', () => {
    it('renders BMI Calculator with interactive inputs and medical disclaimer', () => {
      render(
        <ToastProvider>
          <BodyMassIndexCalculator />
        </ToastProvider>
      );
      expect(screen.getByText(/BMI is a statistical screening measure/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Metric/i })).toBeInTheDocument();
    });

    it('renders Calorie Needs Calculator and handles inputs', () => {
      render(
        <ToastProvider>
          <CalorieNeedsCalculator />
        </ToastProvider>
      );
      expect(screen.getByText(/Maintenance/i)).toBeInTheDocument();
      expect(screen.getByText(/Mild Weight Loss/i)).toBeInTheDocument();
    });

    it('renders Push-up Counter with interactive tap increment', () => {
      render(
        <ToastProvider>
          <PushUpCounter />
        </ToastProvider>
      );
      
      const tapBtn = screen.getByText(/Tap for Rep/i);
      expect(tapBtn).toBeInTheDocument();

      fireEvent.click(tapBtn);
      fireEvent.click(tapBtn);

      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('renders Sleep Calculator with bedtime calculation', () => {
      render(
        <ToastProvider>
          <SleepCalculator />
        </ToastProvider>
      );
      expect(screen.getByText(/Suggested Bedtimes/i)).toBeInTheDocument();
      expect(screen.getByText(/I want to wake up at/i)).toBeInTheDocument();
    });
  });
});
