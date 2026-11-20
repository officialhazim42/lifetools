import React from 'react';
import { UniversalUnitConverter, UnitDef } from './UniversalUnitConverter';

const pressureUnits: UnitDef[] = [
  { id: 'pa', name: 'Pascal', symbol: 'Pa', toBase: (v) => v, fromBase: (b) => b },
  { id: 'kpa', name: 'Kilopascal', symbol: 'kPa', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
  { id: 'bar', name: 'Bar', symbol: 'bar', toBase: (v) => v * 100000, fromBase: (b) => b / 100000 },
  { id: 'psi', name: 'Pounds per Square Inch', symbol: 'psi', toBase: (v) => v * 6894.757, fromBase: (b) => b / 6894.757 },
  { id: 'atm', name: 'Standard Atmosphere', symbol: 'atm', toBase: (v) => v * 101325, fromBase: (b) => b / 101325 },
  { id: 'mmhg', name: 'Millimeters of Mercury / Torr', symbol: 'mmHg', toBase: (v) => v * 133.322, fromBase: (b) => b / 133.322 },
];

export const PressureConverter: React.FC = () => {
  return (
    <UniversalUnitConverter
      title="Pressure Converter"
      baseUnitId="pa"
      units={pressureUnits}
      defaultFromUnit="bar"
      defaultToUnit="psi"
      defaultVal={2.5}
    />
  );
};
