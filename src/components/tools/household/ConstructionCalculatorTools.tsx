import React, { useState } from 'react';
import {
  Hammer,
  Layers,
  Grid,
  Box,
  Building,
  Ruler,
  DollarSign,
  Copy,
  Check,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import {
  calculateConcreteVolume,
  calculateBricks,
  calculateTiles,
  calculatePlaster,
  calculateRoofing,
  calculateStaircaseGeometry,
  estimateConstructionCost
} from '../../../utils/household/constructionCalculators';

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return { copied, copy };
}

// 16. Cement Calculator
export const CementCalculator: React.FC = () => {
  const [volumeCuM, setVolumeCuM] = useState<number>(5);
  const [cementRatio, setCementRatio] = useState<number>(1);
  const [sandRatio, setSandRatio] = useState<number>(2);
  const [aggRatio, setAggRatio] = useState<number>(4);

  const res = calculateConcreteVolume(volumeCuM, 1, 1, {
    cement: cementRatio,
    sand: sandRatio,
    aggregate: aggRatio
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="font-semibold block mb-1">Wet Volume (m³)</label>
            <input
              type="number"
              min="0.1"
              value={volumeCuM}
              onChange={e => setVolumeCuM(Math.max(0.1, Number(e.target.value)))}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Cement Parts</label>
            <input
              type="number"
              value={cementRatio}
              onChange={e => setCementRatio(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Sand Parts</label>
            <input
              type="number"
              value={sandRatio}
              onChange={e => setSandRatio(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">Aggregate Parts</label>
            <input
              type="number"
              value={aggRatio}
              onChange={e => setAggRatio(Number(e.target.value))}
              className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800">
          <span className="text-xs text-amber-700 dark:text-amber-400 uppercase font-semibold">Cement Bags (50kg)</span>
          <div className="text-3xl font-bold font-mono text-amber-900 dark:text-amber-200 mt-1">
            {res.cementBags50kg} Bags
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400">{res.cementKg} kg total</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Dry Volume Factor</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {res.dryVolumeCuM} m³
          </div>
          <span className="text-[11px] text-slate-400">1.54x concrete expansion</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Volume in Cu Ft</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {res.dryVolumeCuFt} ft³
          </div>
          <span className="text-[11px] text-slate-400">Total dry materials</span>
        </div>
      </div>
    </div>
  );
};

// 17. Concrete Calculator
export const ConcreteCalculator: React.FC = () => {
  const [lengthM, setLengthM] = useState<number>(6);
  const [widthM, setWidthM] = useState<number>(4);
  const [thickM, setThickM] = useState<number>(0.15); // 15cm slab ~ 6 inches
  const [grade, setGrade] = useState<string>('m15');

  const mix =
    grade === 'm20' ? { cement: 1, sand: 1.5, aggregate: 3 } :
    grade === 'm25' ? { cement: 1, sand: 1, aggregate: 2 } :
    { cement: 1, sand: 2, aggregate: 4 }; // M15 standard

  const res = calculateConcreteVolume(lengthM, widthM, thickM, mix);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Length (Meters)</label>
          <input
            type="number"
            value={lengthM}
            onChange={e => setLengthM(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Width (Meters)</label>
          <input
            type="number"
            value={widthM}
            onChange={e => setWidthM(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Thickness (Meters)</label>
          <input
            type="number"
            step="0.01"
            value={thickM}
            onChange={e => setThickM(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Concrete Grade</label>
          <select
            value={grade}
            onChange={e => setGrade(e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          >
            <option value="m15">M15 (1:2:4) - Standard Slab</option>
            <option value="m20">M20 (1:1.5:3) - Reinforced RCC</option>
            <option value="m25">M25 (1:1:2) - Heavy Columns</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <span className="text-xs text-slate-500 uppercase">Wet Volume</span>
          <div className="text-xl font-bold font-mono mt-1">{res.wetVolumeCuM} m³</div>
          <span className="text-[11px] text-slate-400">({res.wetVolumeCuFt} cu ft)</span>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 rounded-xl">
          <span className="text-xs uppercase font-semibold">Cement Bags</span>
          <div className="text-xl font-bold font-mono mt-1">{res.cementBags50kg} Bags</div>
          <span className="text-[11px]">{res.cementKg} kg</span>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <span className="text-xs text-slate-500 uppercase">Sand (Fine Agg)</span>
          <div className="text-xl font-bold font-mono mt-1">{res.sandCuFt} cu ft</div>
          <span className="text-[11px] text-slate-400">~{res.sandTons} Tons</span>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <span className="text-xs text-slate-500 uppercase">Coarse Aggregate</span>
          <div className="text-xl font-bold font-mono mt-1">{res.aggregateCuFt} cu ft</div>
          <span className="text-[11px] text-slate-400">~{res.aggregateTons} Tons</span>
        </div>
      </div>
    </div>
  );
};

// 18. Brick Calculator
export const BrickCalculator: React.FC = () => {
  const [wallLen, setWallLen] = useState<number>(10);
  const [wallHt, setWallHt] = useState<number>(3);
  const [wallThick, setWallThick] = useState<number>(0.23); // 9 inches
  const [deductions, setDeductions] = useState<number>(4); // door/window area sq m

  const res = calculateBricks(wallLen, wallHt, wallThick, deductions);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Wall Length (m)</label>
          <input
            type="number"
            value={wallLen}
            onChange={e => setWallLen(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Wall Height (m)</label>
          <input
            type="number"
            value={wallHt}
            onChange={e => setWallHt(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Wall Thickness</label>
          <select
            value={wallThick}
            onChange={e => setWallThick(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          >
            <option value={0.115}>4.5 inches (Single Leaf / 115mm)</option>
            <option value={0.23}>9 inches (Double Leaf / 230mm)</option>
            <option value={0.345}>13.5 inches (Thick Foundation)</option>
          </select>
        </div>
        <div>
          <label className="font-semibold block mb-1">Openings Deduct (m²)</label>
          <input
            type="number"
            value={deductions}
            onChange={e => setDeductions(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800">
          <span className="text-xs text-rose-700 dark:text-rose-400 uppercase font-semibold">Bricks Needed</span>
          <div className="text-3xl font-bold font-mono text-rose-900 dark:text-rose-200 mt-1">
            {res.bricksNeeded.toLocaleString()}
          </div>
          <span className="text-[11px] text-rose-600 dark:text-rose-400">Includes 7% breakage buffer</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Mortar Cement</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {res.cementBags50kg} Bags
          </div>
          <span className="text-[11px] text-slate-400">1:5 Masonry mix</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Mortar Sand</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {res.sandCuFt} cu ft
          </div>
          <span className="text-[11px] text-slate-400">Fine aggregate</span>
        </div>
      </div>
    </div>
  );
};

// 19. Sand Quantity Calculator
export const SandQuantityCalculator: React.FC = () => {
  const [volCuFt, setVolCuFt] = useState<number>(100);

  const volCuM = volCuFt / 35.3147;
  const tons = (volCuM * 1600) / 1000;
  const brass = volCuFt / 100; // 1 Brass = 100 cu ft

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <label className="text-xs font-semibold block mb-1">Sand Volume (Cubic Feet)</label>
        <input
          type="number"
          value={volCuFt}
          onChange={e => setVolCuFt(Math.max(1, Number(e.target.value)))}
          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">
          <span className="text-xs text-slate-500 uppercase">Metric Volume</span>
          <div className="text-2xl font-bold font-mono mt-1">{volCuM.toFixed(2)} m³</div>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 rounded-xl">
          <span className="text-xs text-amber-700 uppercase font-semibold">Estimated Weight</span>
          <div className="text-2xl font-bold font-mono text-amber-900 mt-1">{tons.toFixed(2)} Tons</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">
          <span className="text-xs text-slate-500 uppercase">Brass Units</span>
          <div className="text-2xl font-bold font-mono mt-1">{brass.toFixed(2)} Brass</div>
        </div>
      </div>
    </div>
  );
};

// 20. Aggregate Calculator
export const AggregateCalculator: React.FC = () => {
  const [volCuFt, setVolCuFt] = useState<number>(200);

  const volCuM = volCuFt / 35.3147;
  const tons = (volCuM * 1500) / 1000;
  const brass = volCuFt / 100;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <label className="text-xs font-semibold block mb-1">Coarse Aggregate Volume (Cubic Feet)</label>
        <input
          type="number"
          value={volCuFt}
          onChange={e => setVolCuFt(Math.max(1, Number(e.target.value)))}
          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border rounded-lg text-sm"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">
          <span className="text-xs text-slate-500 uppercase">Metric Volume</span>
          <div className="text-2xl font-bold font-mono mt-1">{volCuM.toFixed(2)} m³</div>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <span className="text-xs text-slate-500 uppercase font-semibold">Estimated Weight</span>
          <div className="text-2xl font-bold font-mono mt-1">{tons.toFixed(2)} Tons</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">
          <span className="text-xs text-slate-500 uppercase">Brass Units</span>
          <div className="text-2xl font-bold font-mono mt-1">{brass.toFixed(2)} Brass</div>
        </div>
      </div>
    </div>
  );
};

// 21. Tile Calculator
export const TileCalculator: React.FC = () => {
  const [roomL, setRoomL] = useState<number>(15);
  const [roomW, setRoomW] = useState<number>(12);
  const [tileL, setTileL] = useState<number>(60); // 60cm
  const [tileW, setTileW] = useState<number>(60);
  const [tilesBox, setTilesBox] = useState<number>(4);
  const [priceBox, setPriceBox] = useState<number>(35);

  const res = calculateTiles(roomL, roomW, tileL, tileW, 2, tilesBox, priceBox, 10, 'feet');

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Room Length (ft)</label>
          <input
            type="number"
            value={roomL}
            onChange={e => setRoomL(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Room Width (ft)</label>
          <input
            type="number"
            value={roomW}
            onChange={e => setRoomW(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Tile Dimensions (cm)</label>
          <div className="flex gap-1">
            <input
              type="number"
              value={tileL}
              onChange={e => setTileL(Number(e.target.value))}
              className="w-1/2 px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
            />
            <input
              type="number"
              value={tileW}
              onChange={e => setTileW(Number(e.target.value))}
              className="w-1/2 px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
            />
          </div>
        </div>
        <div>
          <label className="font-semibold block mb-1">Tiles Per Box</label>
          <input
            type="number"
            value={tilesBox}
            onChange={e => setTilesBox(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Price Per Box ($)</label>
          <input
            type="number"
            value={priceBox}
            onChange={e => setPriceBox(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <span className="text-xs text-emerald-700 dark:text-emerald-400 uppercase font-semibold">Boxes to Buy</span>
          <div className="text-3xl font-bold font-mono text-emerald-900 dark:text-emerald-200 mt-1">
            {res.boxesNeeded} Boxes
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">{res.tilesNeeded} tiles (10% waste)</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Room Area</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {res.roomAreaSqFt} sq ft
          </div>
          <span className="text-[11px] text-slate-400">{res.roomAreaSqM} m²</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Estimated Cost</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            ${res.totalCost}
          </div>
          <span className="text-[11px] text-slate-400">Material only</span>
        </div>
      </div>
    </div>
  );
};

// 22. Flooring Cost Calculator
export const FlooringCostCalculator: React.FC = () => {
  const [areaSqFt, setAreaSqFt] = useState<number>(300);
  const [materialRate, setMaterialRate] = useState<number>(4.5);
  const [laborRate, setLaborRate] = useState<number>(2.5);
  const [underlayRate, setUnderlayRate] = useState<number>(0.5);

  const materialCost = areaSqFt * materialRate * 1.1; // 10% wastage
  const laborCost = areaSqFt * laborRate;
  const underlayCost = areaSqFt * underlayRate;
  const total = materialCost + laborCost + underlayCost;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Area (sq ft)</label>
          <input
            type="number"
            value={areaSqFt}
            onChange={e => setAreaSqFt(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Flooring ($/sq ft)</label>
          <input
            type="number"
            step="0.5"
            value={materialRate}
            onChange={e => setMaterialRate(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Labor ($/sq ft)</label>
          <input
            type="number"
            step="0.5"
            value={laborRate}
            onChange={e => setLaborRate(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Underlay ($/sq ft)</label>
          <input
            type="number"
            step="0.1"
            value={underlayRate}
            onChange={e => setUnderlayRate(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
      </div>

      <div className="bg-slate-900 text-white p-5 rounded-xl flex justify-between items-center">
        <div>
          <span className="text-xs uppercase text-slate-400">Total Installed Cost</span>
          <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">${total.toFixed(0)}</div>
          <p className="text-xs text-slate-400 mt-1">${(total / areaSqFt).toFixed(2)} / sq ft all-inclusive</p>
        </div>
        <div className="text-xs text-right space-y-1 text-slate-300">
          <div>Materials: <strong>${materialCost.toFixed(0)}</strong></div>
          <div>Installation: <strong>${laborCost.toFixed(0)}</strong></div>
          <div>Underlayment: <strong>${underlayCost.toFixed(0)}</strong></div>
        </div>
      </div>
    </div>
  );
};

// 23. Wall Area Calculator
export const WallAreaCalculator: React.FC = () => {
  const [wallLength, setWallLength] = useState<number>(20);
  const [wallHeight, setWallHeight] = useState<number>(9);
  const [doors, setDoors] = useState<number>(2);
  const [windows, setWindows] = useState<number>(2);

  const grossArea = wallLength * wallHeight;
  const deductions = doors * 21 + windows * 15;
  const netArea = Math.max(0, grossArea - deductions);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Total Wall Length (ft)</label>
          <input
            type="number"
            value={wallLength}
            onChange={e => setWallLength(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Ceiling Height (ft)</label>
          <input
            type="number"
            value={wallHeight}
            onChange={e => setWallHeight(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Doors (3x7 ft)</label>
          <input
            type="number"
            value={doors}
            onChange={e => setDoors(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Windows (3x5 ft)</label>
          <input
            type="number"
            value={windows}
            onChange={e => setWindows(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">
          <span className="text-xs text-slate-500 uppercase">Gross Wall</span>
          <div className="text-2xl font-bold font-mono mt-1">{grossArea} sq ft</div>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <span className="text-xs text-slate-500 uppercase">Deductions</span>
          <div className="text-2xl font-bold font-mono mt-1">-{deductions} sq ft</div>
        </div>
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl">
          <span className="text-xs text-emerald-700 uppercase font-semibold">Net Surface Area</span>
          <div className="text-2xl font-bold font-mono text-emerald-900 mt-1">{netArea} sq ft</div>
        </div>
      </div>
    </div>
  );
};

// 24. Plaster Calculator
export const PlasterCalculator: React.FC = () => {
  const [areaSqM, setAreaSqM] = useState<number>(50);
  const [thicknessMm, setThicknessMm] = useState<number>(12); // 12mm internal
  const [ratio, setRatio] = useState<string>('1:4');

  const mix = ratio === '1:4' ? { cement: 1, sand: 4 } : { cement: 1, sand: 6 };
  const res = calculatePlaster(areaSqM, thicknessMm, mix);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Plaster Area (m²)</label>
          <input
            type="number"
            value={areaSqM}
            onChange={e => setAreaSqM(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Thickness (mm)</label>
          <select
            value={thicknessMm}
            onChange={e => setThicknessMm(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          >
            <option value={12}>12 mm (Interior Wall)</option>
            <option value={15}>15 mm (Ceiling / Rough)</option>
            <option value={20}>20 mm (Exterior Weather)</option>
          </select>
        </div>
        <div>
          <label className="font-semibold block mb-1">Mix Ratio</label>
          <select
            value={ratio}
            onChange={e => setRatio(e.target.value)}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          >
            <option value="1:4">1:4 (Rich Plaster)</option>
            <option value="1:6">1:6 (Standard)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800">
          <span className="text-xs text-amber-700 dark:text-amber-400 uppercase font-semibold">Cement Bags</span>
          <div className="text-2xl font-bold font-mono text-amber-900 dark:text-amber-200 mt-1">
            {res.cementBags50kg} Bags
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400">{res.cementKg} kg</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Sand Needed</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {res.sandCuFt} cu ft
          </div>
          <span className="text-[11px] text-slate-400">{res.sandCuM} m³</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500 uppercase">Wet Volume</span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            {res.plasterVolumeCuM} m³
          </div>
          <span className="text-[11px] text-slate-400">Includes 10% wastage</span>
        </div>
      </div>
    </div>
  );
};

// 25. Roofing Material Calculator
export const RoofingMaterialCalculator: React.FC = () => {
  const [len, setLen] = useState<number>(40);
  const [wid, setWid] = useState<number>(30);
  const [pitch, setPitch] = useState<number>(4); // 4/12 pitch

  const res = calculateRoofing(len, wid, pitch);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Building Length (ft)</label>
          <input
            type="number"
            value={len}
            onChange={e => setLen(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Building Width (ft)</label>
          <input
            type="number"
            value={wid}
            onChange={e => setWid(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Roof Pitch Slope</label>
          <select
            value={pitch}
            onChange={e => setPitch(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          >
            <option value={3}>3/12 (Low Slope)</option>
            <option value={4}>4/12 (Standard Gable)</option>
            <option value={6}>6/12 (Medium Pitch)</option>
            <option value={8}>8/12 (Steep Pitch)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-800">
          <span className="text-xs text-sky-700 uppercase font-semibold">Roof Squares</span>
          <div className="text-2xl font-bold font-mono text-sky-900 mt-1">{res.roofingSquares}</div>
          <span className="text-[11px] text-sky-600">1 Sq = 100 sq ft</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">
          <span className="text-xs text-slate-500 uppercase">Shingle Bundles</span>
          <div className="text-2xl font-bold font-mono mt-1">{res.shingleBundles}</div>
          <span className="text-[11px] text-slate-400">3 bundles / sq</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">
          <span className="text-xs text-slate-500 uppercase">Underlayment</span>
          <div className="text-2xl font-bold font-mono mt-1">{res.underlaymentRolls} Rolls</div>
          <span className="text-[11px] text-slate-400">Felt / synthetic</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">
          <span className="text-xs text-slate-500 uppercase">Ridge Cap</span>
          <div className="text-2xl font-bold font-mono mt-1">{res.ridgeLengthFeet} ft</div>
          <span className="text-[11px] text-slate-400">Peak length</span>
        </div>
      </div>
    </div>
  );
};

// 26. Staircase Calculator
export const StaircaseCalculator: React.FC = () => {
  const [totalRise, setTotalRise] = useState<number>(108); // 9ft floor to floor = 108 inches
  const [targetRiser, setTargetRiser] = useState<number>(7.25);
  const [targetTread, setTargetTread] = useState<number>(11.0);

  const res = calculateStaircaseGeometry(totalRise, targetRiser, targetTread);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Total Rise (Floor-to-Floor, In)</label>
          <input
            type="number"
            value={totalRise}
            onChange={e => setTotalRise(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Ideal Riser (Inches)</label>
          <input
            type="number"
            step="0.25"
            value={targetRiser}
            onChange={e => setTargetRiser(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Tread Run (Inches)</label>
          <input
            type="number"
            step="0.5"
            value={targetTread}
            onChange={e => setTargetTread(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <span className="text-xs text-emerald-700 uppercase font-semibold">Total Steps</span>
          <div className="text-2xl font-bold font-mono text-emerald-900 mt-1">{res.stepsCount} Risers</div>
          <span className="text-[11px] text-emerald-600">{res.numberOfTreads} Treads</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">
          <span className="text-xs text-slate-500 uppercase">Actual Riser Height</span>
          <div className="text-2xl font-bold font-mono mt-1">{res.actualRiserInches}"</div>
          <span className="text-[11px] text-slate-400">Code standard: 7"-7.75"</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">
          <span className="text-xs text-slate-500 uppercase">Total Horizontal Run</span>
          <div className="text-2xl font-bold font-mono mt-1">{res.totalRunFeet} ft</div>
          <span className="text-[11px] text-slate-400">({res.totalRunInches} inches)</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">
          <span className="text-xs text-slate-500 uppercase">Stair Angle</span>
          <div className="text-2xl font-bold font-mono mt-1">{res.angleDegrees}°</div>
          <span className="text-[11px] text-slate-400">Stringer: {res.stringerLengthFeet} ft</span>
        </div>
      </div>
    </div>
  );
};

// 27. Door & Window Area Calculator
export const DoorWindowAreaCalculator: React.FC = () => {
  const [doors, setDoors] = useState<Array<{ w: number; h: number; count: number }>>([
    { w: 3, h: 7, count: 3 }
  ]);
  const [windows, setWindows] = useState<Array<{ w: number; h: number; count: number }>>([
    { w: 4, h: 5, count: 4 }
  ]);

  const totalDoorArea = doors.reduce((sum, d) => sum + d.w * d.h * d.count, 0);
  const totalWindowArea = windows.reduce((sum, w) => sum + w.w * w.h * w.count, 0);
  const grandTotalArea = totalDoorArea + totalWindowArea;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
        <h4 className="font-semibold text-slate-800 dark:text-slate-200">Aperture Schedule (Feet)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-slate-600 dark:text-slate-400 mb-2 block">Doors</span>
            {doors.map((d, i) => (
              <div key={i} className="flex gap-2 items-center mb-1">
                <input
                  type="number"
                  value={d.count}
                  onChange={e => {
                    const c = [...doors];
                    c[i].count = Number(e.target.value);
                    setDoors(c);
                  }}
                  className="w-12 px-1 py-1 border rounded"
                  placeholder="Qty"
                />
                <span>qty of {d.w}' × {d.h}'</span>
              </div>
            ))}
          </div>
          <div>
            <span className="font-medium text-slate-600 dark:text-slate-400 mb-2 block">Windows</span>
            {windows.map((w, i) => (
              <div key={i} className="flex gap-2 items-center mb-1">
                <input
                  type="number"
                  value={w.count}
                  onChange={e => {
                    const c = [...windows];
                    c[i].count = Number(e.target.value);
                    setWindows(c);
                  }}
                  className="w-12 px-1 py-1 border rounded"
                  placeholder="Qty"
                />
                <span>qty of {w.w}' × {w.h}'</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">
          <span className="text-xs text-slate-500 uppercase">Door Area</span>
          <div className="text-2xl font-bold font-mono mt-1">{totalDoorArea} sq ft</div>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">
          <span className="text-xs text-slate-500 uppercase">Glazed Window Area</span>
          <div className="text-2xl font-bold font-mono mt-1">{totalWindowArea} sq ft</div>
        </div>
        <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 rounded-xl">
          <span className="text-xs text-indigo-700 uppercase font-semibold">Total Apertures</span>
          <div className="text-2xl font-bold font-mono text-indigo-900 mt-1">{grandTotalArea} sq ft</div>
        </div>
      </div>
    </div>
  );
};

// 28. Construction Cost Estimator
export const ConstructionCostEstimator: React.FC = () => {
  const [plinthArea, setPlinthArea] = useState<number>(2000);
  const [tier, setTier] = useState<'economy' | 'standard' | 'premium'>('standard');
  const [customRate, setCustomRate] = useState<number>(200);

  const res = estimateConstructionCost(plinthArea, tier, customRate);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Built-up Area (sq ft)</label>
          <input
            type="number"
            value={plinthArea}
            onChange={e => setPlinthArea(Math.max(1, Number(e.target.value)))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Specification Grade</label>
          <select
            value={tier}
            onChange={e => {
              const val = e.target.value as any;
              setTier(val);
              setCustomRate(val === 'economy' ? 140 : val === 'standard' ? 200 : 320);
            }}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          >
            <option value="economy">Economy / Basic ($140/sq ft)</option>
            <option value="standard">Standard / Modern ($200/sq ft)</option>
            <option value="premium">Premium / Luxury ($320/sq ft)</option>
          </select>
        </div>
        <div>
          <label className="font-semibold block mb-1">Rate ($/sq ft)</label>
          <input
            type="number"
            value={customRate}
            onChange={e => setCustomRate(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <span className="text-xs uppercase text-slate-400">Total Construction Forecast</span>
          <div className="text-4xl font-extrabold font-mono text-emerald-400 mt-1">
            ${res.totalEstimatedCost.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">Estimated turn-key construction across {plinthArea.toLocaleString()} sq ft</p>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-300">
          <div>Grey Structure (45%): <strong>${res.breakdown.structureAndGrey.toLocaleString()}</strong></div>
          <div>Finishing & Tiles (15%): <strong>${res.breakdown.finishingAndFlooring.toLocaleString()}</strong></div>
          <div>Electrical & HVAC (12%): <strong>${res.breakdown.electricalAndHvac.toLocaleString()}</strong></div>
          <div>Woodwork & Glass (12%): <strong>${res.breakdown.woodworkDoorsWindows.toLocaleString()}</strong></div>
          <div>Plumbing & Sanitary (10%): <strong>${res.breakdown.plumbingAndSanitary.toLocaleString()}</strong></div>
          <div>Contingency Reserve (6%): <strong>${res.breakdown.contingencyReserve.toLocaleString()}</strong></div>
        </div>
      </div>
    </div>
  );
};

// 29. Construction Material Cost Calculator
export const ConstructionMaterialCostCalculator: React.FC = () => {
  const [items, setItems] = useState<Array<{ name: string; qty: number; unit: string; rate: number }>>([
    { name: 'Portland Cement', qty: 300, unit: 'Bags', rate: 12 },
    { name: 'Deformed Steel Rebar', qty: 4, unit: 'Tons', rate: 950 },
    { name: 'Fine River Sand', qty: 800, unit: 'cu ft', rate: 1.2 },
    { name: 'Crushed Coarse Aggregate', qty: 1200, unit: 'cu ft', rate: 1.4 },
    { name: 'Clay Bricks', qty: 15000, unit: 'Pcs', rate: 0.25 }
  ]);

  const totalCost = items.reduce((sum, item) => sum + item.qty * item.rate, 0);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <tr>
              <th className="p-3">Material</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Unit</th>
              <th className="p-3">Unit Rate ($)</th>
              <th className="p-3">Subtotal ($)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {items.map((it, idx) => (
              <tr key={idx}>
                <td className="p-3 font-medium">{it.name}</td>
                <td className="p-3">
                  <input
                    type="number"
                    value={it.qty}
                    onChange={e => {
                      const copy = [...items];
                      copy[idx].qty = Number(e.target.value);
                      setItems(copy);
                    }}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-3 text-slate-500">{it.unit}</td>
                <td className="p-3">
                  <input
                    type="number"
                    value={it.rate}
                    onChange={e => {
                      const copy = [...items];
                      copy[idx].rate = Number(e.target.value);
                      setItems(copy);
                    }}
                    className="w-20 px-2 py-1 border rounded"
                  />
                </td>
                <td className="p-3 font-mono font-semibold">${(it.qty * it.rate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl">
        <span className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">Total Material BOQ Tally</span>
        <span className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
          ${totalCost.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

// 30. Renovation Budget Planner
export const RenovationBudgetPlanner: React.FC = () => {
  const [projectType, setProjectType] = useState<string>('Kitchen Remodel');
  const [demolition, setDemolition] = useState<number>(1500);
  const [cabinetry, setCabinetry] = useState<number>(8000);
  const [countertops, setCountertops] = useState<number>(3500);
  const [appliances, setAppliances] = useState<number>(4000);
  const [plumbingElectrical, setPlumbingElectrical] = useState<number>(3000);
  const [labor, setLabor] = useState<number>(5000);
  const [contingencyPct, setContingencyPct] = useState<number>(15);

  const subtotal = demolition + cabinetry + countertops + appliances + plumbingElectrical + labor;
  const contingency = (subtotal * contingencyPct) / 100;
  const total = subtotal + contingency;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div>
          <label className="font-semibold block mb-1">Demolition & Disposal ($)</label>
          <input
            type="number"
            value={demolition}
            onChange={e => setDemolition(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Cabinetry & Millwork ($)</label>
          <input
            type="number"
            value={cabinetry}
            onChange={e => setCabinetry(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Countertops & Surfaces ($)</label>
          <input
            type="number"
            value={countertops}
            onChange={e => setCountertops(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Fixtures & Appliances ($)</label>
          <input
            type="number"
            value={appliances}
            onChange={e => setAppliances(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Plumbing & Electrical ($)</label>
          <input
            type="number"
            value={plumbingElectrical}
            onChange={e => setPlumbingElectrical(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
        <div>
          <label className="font-semibold block mb-1">Contractor Labor ($)</label>
          <input
            type="number"
            value={labor}
            onChange={e => setLabor(Number(e.target.value))}
            className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border rounded"
          />
        </div>
      </div>

      <div className="bg-slate-900 text-white p-5 rounded-xl flex justify-between items-center">
        <div>
          <span className="text-xs uppercase text-slate-400">Total Renovation Budget</span>
          <div className="text-3xl font-bold font-mono text-emerald-400 mt-1">
            ${total.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Subtotal: ${subtotal.toLocaleString()} + 15% Contingency Reserve: ${contingency.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};
