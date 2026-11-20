import React from 'react';
import { UniversalUnitConverter, UnitDef } from './UniversalUnitConverter';

const lengthUnits: UnitDef[] = [
  { id: 'm', name: 'Meters', symbol: 'm', toBase: (v) => v, fromBase: (b) => b },
  { id: 'km', name: 'Kilometers', symbol: 'km', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
  { id: 'cm', name: 'Centimeters', symbol: 'cm', toBase: (v) => v / 100, fromBase: (b) => b * 100 },
  { id: 'mm', name: 'Millimeters', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (b) => b * 1000 },
  { id: 'mi', name: 'Miles', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (b) => b / 1609.344 },
  { id: 'yd', name: 'Yards', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (b) => b / 0.9144 },
  { id: 'ft', name: 'Feet', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (b) => b / 0.3048 },
  { id: 'in', name: 'Inches', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (b) => b / 0.0254 },
  { id: 'nmi', name: 'Nautical Miles', symbol: 'nmi', toBase: (v) => v * 1852, fromBase: (b) => b / 1852 },
];

export const LengthConverter: React.FC = () => {
  return (
    <UniversalUnitConverter
      title="Length Converter"
      baseUnitId="m"
      units={lengthUnits}
      defaultFromUnit="m"
      defaultToUnit="ft"
      defaultVal={10}
    />
  );
};
