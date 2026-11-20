import React from 'react';
import { UniversalUnitConverter, UnitDef } from './UniversalUnitConverter';

const weightUnits: UnitDef[] = [
  { id: 'kg', name: 'Kilograms', symbol: 'kg', toBase: (v) => v, fromBase: (b) => b },
  { id: 'g', name: 'Grams', symbol: 'g', toBase: (v) => v / 1000, fromBase: (b) => b * 1000 },
  { id: 'mg', name: 'Milligrams', symbol: 'mg', toBase: (v) => v / 1000000, fromBase: (b) => b * 1000000 },
  { id: 'lb', name: 'Pounds', symbol: 'lb', toBase: (v) => v * 0.45359237, fromBase: (b) => b / 0.45359237 },
  { id: 'oz', name: 'Ounces', symbol: 'oz', toBase: (v) => v * 0.0283495231, fromBase: (b) => b / 0.0283495231 },
  { id: 'st', name: 'Stone', symbol: 'st', toBase: (v) => v * 6.35029318, fromBase: (b) => b / 6.35029318 },
  { id: 't', name: 'Metric Tons', symbol: 't', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
  { id: 'ct', name: 'Carats', symbol: 'ct', toBase: (v) => v * 0.0002, fromBase: (b) => b / 0.0002 },
];

export const WeightConverter: React.FC = () => {
  return (
    <UniversalUnitConverter
      title="Weight Converter"
      baseUnitId="kg"
      units={weightUnits}
      defaultFromUnit="kg"
      defaultToUnit="lb"
      defaultVal={5}
    />
  );
};
