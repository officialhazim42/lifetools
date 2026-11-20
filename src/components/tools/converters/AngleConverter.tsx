import React from 'react';
import { UniversalUnitConverter, UnitDef } from './UniversalUnitConverter';

const angleUnits: UnitDef[] = [
  { id: 'deg', name: 'Degrees', symbol: '°', toBase: (v) => v, fromBase: (b) => b },
  { id: 'rad', name: 'Radians', symbol: 'rad', toBase: (v) => (v * 180) / Math.PI, fromBase: (b) => (b * Math.PI) / 180 },
  { id: 'grad', name: 'Gradians', symbol: 'grad', toBase: (v) => v * 0.9, fromBase: (b) => b / 0.9 },
  { id: 'arcmin', name: 'Arcminutes', symbol: 'arcmin', toBase: (v) => v / 60, fromBase: (b) => b * 60 },
  { id: 'arcsec', name: 'Arcseconds', symbol: 'arcsec', toBase: (v) => v / 3600, fromBase: (b) => b * 3600 },
  { id: 'rev', name: 'Revolutions / Turns', symbol: 'rev', toBase: (v) => v * 360, fromBase: (b) => b / 360 },
];

export const AngleConverter: React.FC = () => {
  return (
    <UniversalUnitConverter
      title="Angle Converter"
      baseUnitId="deg"
      units={angleUnits}
      defaultFromUnit="deg"
      defaultToUnit="rad"
      defaultVal={90}
    />
  );
};
