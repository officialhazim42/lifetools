import React from 'react';
import { UniversalUnitConverter, UnitDef } from './UniversalUnitConverter';

const powerUnits: UnitDef[] = [
  { id: 'w', name: 'Watts', symbol: 'W', toBase: (v) => v, fromBase: (b) => b },
  { id: 'kw', name: 'Kilowatts', symbol: 'kW', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
  { id: 'mw', name: 'Megawatts', symbol: 'MW', toBase: (v) => v * 1000000, fromBase: (b) => b / 1000000 },
  { id: 'hp', name: 'Mechanical Horsepower', symbol: 'hp', toBase: (v) => v * 745.699872, fromBase: (b) => b / 745.699872 },
  { id: 'btuh', name: 'BTU per Hour', symbol: 'BTU/h', toBase: (v) => v * 0.293071, fromBase: (b) => b / 0.293071 },
];

export const PowerConverter: React.FC = () => {
  return (
    <UniversalUnitConverter
      title="Power Converter"
      baseUnitId="w"
      units={powerUnits}
      defaultFromUnit="kw"
      defaultToUnit="hp"
      defaultVal={150}
    />
  );
};
