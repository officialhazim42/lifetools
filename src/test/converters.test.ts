import { describe, it, expect } from 'vitest';

describe('Unit Converters Logic Tests', () => {
  it('converts Length metric to imperial', () => {
    // 1 meter = 3.28084 feet
    const meters = 10;
    const feet = meters * 3.28084;
    expect(Number(feet.toFixed(2))).toBe(32.81);
  });

  it('converts Temperature Celsius to Fahrenheit and Kelvin', () => {
    const c = 25;
    const f = (c * 9) / 5 + 32;
    const k = c + 273.15;
    expect(f).toBe(77);
    expect(k).toBe(298.15);
  });

  it('converts Weight kg to pounds', () => {
    const kg = 10;
    const lbs = kg * 2.20462;
    expect(Number(lbs.toFixed(2))).toBe(22.05);
  });

  it('converts Data Storage bytes to megabytes and gigabytes', () => {
    const bytes = 1073741824; // 1 GiB
    const gib = bytes / (1024 * 1024 * 1024);
    expect(gib).toBe(1);
  });

  it('converts Roman Numerals to Arabic numbers', () => {
    const romanMap: Record<string, number> = {
      M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90,
      L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1
    };

    function romanToInt(s: string): number {
      let num = 0;
      let i = 0;
      while (i < s.length) {
        const two = s.substring(i, i + 2);
        if (romanMap[two]) {
          num += romanMap[two];
          i += 2;
        } else {
          num += romanMap[s[i]];
          i += 1;
        }
      }
      return num;
    }

    expect(romanToInt('MMXXVI')).toBe(2026);
    expect(romanToInt('MCMXCIV')).toBe(1994);
    expect(romanToInt('XLII')).toBe(42);
  });
});
