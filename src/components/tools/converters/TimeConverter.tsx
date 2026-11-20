import React from 'react';
import { UniversalUnitConverter, UnitDef } from './UniversalUnitConverter';

const timeUnits: UnitDef[] = [
  { id: 's', name: 'Seconds', symbol: 's', toBase: (v) => v, fromBase: (b) => b },
  { id: 'ms', name: 'Milliseconds', symbol: 'ms', toBase: (v) => v / 1000, fromBase: (b) => b * 1000 },
  { id: 'min', name: 'Minutes', symbol: 'min', toBase: (v) => v * 60, fromBase: (b) => b / 60 },
  { id: 'h', name: 'Hours', symbol: 'h', toBase: (v) => v * 3600, fromBase: (b) => b / 3600 },
  { id: 'd', name: 'Days', symbol: 'd', toBase: (v) => v * 86400, fromBase: (b) => b / 86400 },
  { id: 'w', name: 'Weeks', symbol: 'wk', toBase: (v) => v * 604800, fromBase: (b) => b / 604800 },
  { id: 'mo', name: 'Months (30 days)', symbol: 'mo', toBase: (v) => v * 2592000, fromBase: (b) => b / 2592000 },
  { id: 'y', name: 'Years (365 days)', symbol: 'yr', toBase: (v) => v * 31536000, fromBase: (b) => b / 31536000 },
];

export const TimeConverter: React.FC = () => {
  return (
    <UniversalUnitConverter
      title="Time Converter"
      baseUnitId="s"
      units={timeUnits}
      defaultFromUnit="h"
      defaultToUnit="min"
      defaultVal={24}
    />
  );
};
