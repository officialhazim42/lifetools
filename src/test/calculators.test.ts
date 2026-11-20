import { describe, it, expect } from 'vitest';

describe('Calculator Logic Unit Tests', () => {
  it('calculates percentage increase correctly', () => {
    const original = 100;
    const newPrice = 125;
    const change = ((newPrice - original) / original) * 100;
    expect(change).toBe(25);
  });

  it('calculates percentage decrease correctly', () => {
    const original = 200;
    const newPrice = 150;
    const change = ((newPrice - original) / original) * 100;
    expect(change).toBe(-25);
  });

  it('calculates standard loan EMI accurately', () => {
    const P = 100000;
    const annualRate = 12;
    const tenureMonths = 12;
    const r = annualRate / 12 / 100;
    const emi = (P * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1);
    expect(Math.round(emi)).toBe(8885);
  });

  it('calculates BMI metric accurately', () => {
    const weightKg = 70;
    const heightM = 1.75;
    const bmi = weightKg / (heightM * heightM);
    expect(Number(bmi.toFixed(1))).toBe(22.9);
  });

  it('calculates simple interest accurately', () => {
    const p = 5000;
    const r = 5;
    const t = 3;
    const interest = (p * r * t) / 100;
    expect(interest).toBe(750);
  });

  it('calculates compound interest correctly', () => {
    const p = 1000;
    const r = 0.05; // 5%
    const n = 1; // annual
    const t = 2; // years
    const amount = p * Math.pow(1 + r / n, n * t);
    expect(Number(amount.toFixed(2))).toBe(1102.50);
  });
});
