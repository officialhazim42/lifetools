import React from 'react';
import { UniversalUnitConverter, UnitDef } from './UniversalUnitConverter';

const speedUnits: UnitDef[] = [
  { id: 'kmh', name: 'Kilometers per Hour', symbol: 'km/h', toBase: (v) => v, fromBase: (b) => b },
  { id: 'mph', name: 'Miles per Hour', symbol: 'mph', toBase: (v) => v * 1.609344, fromBase: (b) => b / 1.609344 },
  { id: 'ms', name: 'Meters per Second', symbol: 'm/s', toBase: (v) => v * 3.6, fromBase: (b) => b / 3.6 },
  { id: 'knots', name: 'Knots (nautical)', symbol: 'kn', toBase: (v) => v * 1.852, fromBase: (b) => b / 1.852 },
  { id: 'fts', name: 'Feet per Second', symbol: 'ft/s', toBase: (v) => v * 1.09728, fromBase: (b) => b / 1.09728 },
  { id: 'mach', name: 'Mach (speed of sound)', symbol: 'Ma', toBase: (v) => v * 1234.8, fromBase: (b) => b / 1234.8 },
];

export const SpeedConverter: React.FC = () => {
  return (
    <UniversalUnitConverter
      title="Speed Converter"
      baseUnitId="kmh"
      units={speedUnits}
      defaultFromUnit="kmh"
      defaultToUnit="mph"
      defaultVal={100}
    />
  );
};
