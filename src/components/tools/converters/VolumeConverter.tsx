import React from 'react';
import { UniversalUnitConverter, UnitDef } from './UniversalUnitConverter';

const volumeUnits: UnitDef[] = [
  { id: 'l', name: 'Liters', symbol: 'L', toBase: (v) => v, fromBase: (b) => b },
  { id: 'ml', name: 'Milliliters', symbol: 'mL', toBase: (v) => v / 1000, fromBase: (b) => b * 1000 },
  { id: 'm3', name: 'Cubic Meters', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
  { id: 'gal_us', name: 'Gallons (US)', symbol: 'gal', toBase: (v) => v * 3.785411784, fromBase: (b) => b / 3.785411784 },
  { id: 'floz_us', name: 'Fluid Ounces (US)', symbol: 'fl oz', toBase: (v) => v * 0.0295735295625, fromBase: (b) => b / 0.0295735295625 },
  { id: 'cup_us', name: 'Cups (US)', symbol: 'cup', toBase: (v) => v * 0.2365882365, fromBase: (b) => b / 0.2365882365 },
  { id: 'pt_us', name: 'Pints (US)', symbol: 'pt', toBase: (v) => v * 0.473176473, fromBase: (b) => b / 0.473176473 },
  { id: 'qt_us', name: 'Quarts (US)', symbol: 'qt', toBase: (v) => v * 0.946352946, fromBase: (b) => b / 0.946352946 },
  { id: 'tbsp', name: 'Tablespoons', symbol: 'tbsp', toBase: (v) => v * 0.01478676478125, fromBase: (b) => b / 0.01478676478125 },
  { id: 'tsp', name: 'Teaspoons', symbol: 'tsp', toBase: (v) => v * 0.00492892159375, fromBase: (b) => b / 0.00492892159375 },
];

export const VolumeConverter: React.FC = () => {
  return (
    <UniversalUnitConverter
      title="Volume Converter"
      baseUnitId="l"
      units={volumeUnits}
      defaultFromUnit="l"
      defaultToUnit="gal_us"
      defaultVal={5}
    />
  );
};
