import React from 'react';
import { UniversalUnitConverter, UnitDef } from './UniversalUnitConverter';

const energyUnits: UnitDef[] = [
  { id: 'j', name: 'Joules', symbol: 'J', toBase: (v) => v, fromBase: (b) => b },
  { id: 'kj', name: 'Kilojoules', symbol: 'kJ', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
  { id: 'wh', name: 'Watt-hours', symbol: 'Wh', toBase: (v) => v * 3600, fromBase: (b) => b / 3600 },
  { id: 'kwh', name: 'Kilowatt-hours', symbol: 'kWh', toBase: (v) => v * 3600000, fromBase: (b) => b / 3600000 },
  { id: 'cal', name: 'Calories (gram cal)', symbol: 'cal', toBase: (v) => v * 4.184, fromBase: (b) => b / 4.184 },
  { id: 'kcal', name: 'Kilocalories (Food kcal)', symbol: 'kcal', toBase: (v) => v * 4184, fromBase: (b) => b / 4184 },
  { id: 'btu', name: 'British Thermal Units', symbol: 'BTU', toBase: (v) => v * 1055.06, fromBase: (b) => b / 1055.06 },
  { id: 'ftlbf', name: 'Foot-Pounds', symbol: 'ft-lb', toBase: (v) => v * 1.355818, fromBase: (b) => b / 1.355818 },
];

export const EnergyConverter: React.FC = () => {
  return (
    <UniversalUnitConverter
      title="Energy Converter"
      baseUnitId="j"
      units={energyUnits}
      defaultFromUnit="kwh"
      defaultToUnit="j"
      defaultVal={1}
    />
  );
};
