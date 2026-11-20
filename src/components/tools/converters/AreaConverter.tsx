import React from 'react';
import { UniversalUnitConverter, UnitDef } from './UniversalUnitConverter';

const areaUnits: UnitDef[] = [
  { id: 'sq_m', name: 'Square Meters', symbol: 'm²', toBase: (v) => v, fromBase: (b) => b },
  { id: 'sq_km', name: 'Square Kilometers', symbol: 'km²', toBase: (v) => v * 1000000, fromBase: (b) => b / 1000000 },
  { id: 'sq_ft', name: 'Square Feet', symbol: 'ft²', toBase: (v) => v * 0.09290304, fromBase: (b) => b / 0.09290304 },
  { id: 'sq_yd', name: 'Square Yards', symbol: 'yd²', toBase: (v) => v * 0.83612736, fromBase: (b) => b / 0.83612736 },
  { id: 'acre', name: 'Acres', symbol: 'ac', toBase: (v) => v * 4046.8564224, fromBase: (b) => b / 4046.8564224 },
  { id: 'hectare', name: 'Hectares', symbol: 'ha', toBase: (v) => v * 10000, fromBase: (b) => b / 10000 },
  { id: 'sq_mi', name: 'Square Miles', symbol: 'mi²', toBase: (v) => v * 2589988.110336, fromBase: (b) => b / 2589988.110336 },
  { id: 'sq_cm', name: 'Square Centimeters', symbol: 'cm²', toBase: (v) => v / 10000, fromBase: (b) => b * 10000 },
];

export const AreaConverter: React.FC = () => {
  return (
    <UniversalUnitConverter
      title="Area Converter"
      baseUnitId="sq_m"
      units={areaUnits}
      defaultFromUnit="sq_m"
      defaultToUnit="sq_ft"
      defaultVal={100}
    />
  );
};
