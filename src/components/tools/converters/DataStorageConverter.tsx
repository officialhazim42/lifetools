import React from 'react';
import { UniversalUnitConverter, UnitDef } from './UniversalUnitConverter';

const dataUnits: UnitDef[] = [
  { id: 'b', name: 'Bytes', symbol: 'B', toBase: (v) => v, fromBase: (b) => b },
  { id: 'kb', name: 'Kilobytes (Decimal)', symbol: 'KB', toBase: (v) => v * 1000, fromBase: (b) => b / 1000 },
  { id: 'mb', name: 'Megabytes (Decimal)', symbol: 'MB', toBase: (v) => v * 1000000, fromBase: (b) => b / 1000000 },
  { id: 'gb', name: 'Gigabytes (Decimal)', symbol: 'GB', toBase: (v) => v * 1000000000, fromBase: (b) => b / 1000000000 },
  { id: 'tb', name: 'Terabytes (Decimal)', symbol: 'TB', toBase: (v) => v * 1000000000000, fromBase: (b) => b / 1000000000000 },
  { id: 'kib', name: 'Kibibytes (Binary)', symbol: 'KiB', toBase: (v) => v * 1024, fromBase: (b) => b / 1024 },
  { id: 'mib', name: 'Mebibytes (Binary)', symbol: 'MiB', toBase: (v) => v * 1048576, fromBase: (b) => b / 1048576 },
  { id: 'gib', name: 'Gibibytes (Binary)', symbol: 'GiB', toBase: (v) => v * 1073741824, fromBase: (b) => b / 1073741824 },
  { id: 'tib', name: 'Tebibytes (Binary)', symbol: 'TiB', toBase: (v) => v * 1099511627776, fromBase: (b) => b / 1099511627776 },
];

export const DataStorageConverter: React.FC = () => {
  return (
    <UniversalUnitConverter
      title="Data Storage Converter"
      baseUnitId="b"
      units={dataUnits}
      defaultFromUnit="gb"
      defaultToUnit="mb"
      defaultVal={16}
    />
  );
};
