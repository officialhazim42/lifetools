/**
 * LifeTools — Construction & Renovation Mathematical Engine
 * Accurate, industry-standard engineering estimation formulas for
 * concrete, cement, masonry bricks, sand, aggregate, tiling, plastering,
 * roofing, stair geometry, construction costs, and renovation budgeting.
 */

export interface ConcreteResult {
  wetVolumeCuM: number;
  dryVolumeCuM: number;
  wetVolumeCuFt: number;
  dryVolumeCuFt: number;
  cementBags50kg: number;
  cementKg: number;
  sandCuM: number;
  sandCuFt: number;
  sandTons: number;
  aggregateCuM: number;
  aggregateCuFt: number;
  aggregateTons: number;
}

export function calculateConcreteVolume(
  lengthMeters: number,
  widthMeters: number,
  thicknessMeters: number,
  mixRatio: { cement: number; sand: number; aggregate: number } = { cement: 1, sand: 2, aggregate: 4 },
  wastagePercent: number = 5
): ConcreteResult {
  const wetVolume = lengthMeters * widthMeters * thicknessMeters;
  const wetVolWithWaste = wetVolume * (1 + wastagePercent / 100);
  // Standard dry volume conversion factor for concrete is 1.54
  const dryVolume = wetVolWithWaste * 1.54;

  const totalParts = mixRatio.cement + mixRatio.sand + mixRatio.aggregate;
  const cementVolCuM = (mixRatio.cement / totalParts) * dryVolume;
  const sandVolCuM = (mixRatio.sand / totalParts) * dryVolume;
  const aggregateVolCuM = (mixRatio.aggregate / totalParts) * dryVolume;

  // 1 bag of cement (50kg) = 0.0347 m³, density ~1440 kg/m³
  const cementKg = cementVolCuM * 1440;
  const cementBags = cementKg / 50;

  // Sand density ~1600 kg/m³
  const sandTons = (sandVolCuM * 1600) / 1000;
  // Aggregate density ~1500 kg/m³
  const aggregateTons = (aggregateVolCuM * 1500) / 1000;

  // 1 m³ = 35.3147 cu ft
  const cuMtoCuFt = 35.3147;

  return {
    wetVolumeCuM: Math.round(wetVolWithWaste * 1000) / 1000,
    dryVolumeCuM: Math.round(dryVolume * 1000) / 1000,
    wetVolumeCuFt: Math.round(wetVolWithWaste * cuMtoCuFt * 100) / 100,
    dryVolumeCuFt: Math.round(dryVolume * cuMtoCuFt * 100) / 100,
    cementBags50kg: Math.ceil(cementBags * 10) / 10,
    cementKg: Math.round(cementKg),
    sandCuM: Math.round(sandVolCuM * 1000) / 1000,
    sandCuFt: Math.round(sandVolCuM * cuMtoCuFt * 100) / 100,
    sandTons: Math.round(sandTons * 100) / 100,
    aggregateCuM: Math.round(aggregateVolCuM * 1000) / 1000,
    aggregateCuFt: Math.round(aggregateVolCuM * cuMtoCuFt * 100) / 100,
    aggregateTons: Math.round(aggregateTons * 100) / 100
  };
}

export function calculateBricks(
  wallLengthMeters: number,
  wallHeightMeters: number,
  wallThicknessMeters: number = 0.23, // 9 inches ~ 0.23m, 4.5 inches ~ 0.115m
  deductionsAreaSqM: number = 0,
  brickLengthMm: number = 190,
  brickWidthMm: number = 90,
  brickHeightMm: number = 90,
  mortarJointMm: number = 10,
  wastagePercent: number = 7
) {
  const grossWallArea = wallLengthMeters * wallHeightMeters;
  const netWallArea = Math.max(0, grossWallArea - deductionsAreaSqM);
  const wallVolumeCuM = netWallArea * wallThicknessMeters;

  // Nominal brick dimensions with 10mm mortar
  const nominalL = (brickLengthMm + mortarJointMm) / 1000;
  const nominalW = (brickWidthMm + mortarJointMm) / 1000;
  const nominalH = (brickHeightMm + mortarJointMm) / 1000;
  const nominalBrickVolume = nominalL * nominalW * nominalH;

  // Actual single brick volume
  const actualBrickVolume = (brickLengthMm / 1000) * (brickWidthMm / 1000) * (brickHeightMm / 1000);

  const rawBrickCount = wallVolumeCuM / nominalBrickVolume;
  const bricksWithWastage = Math.ceil(rawBrickCount * (1 + wastagePercent / 100));

  // Mortar volume = Wall volume - Volume of actual bricks
  const bricksActualTotalVol = rawBrickCount * actualBrickVolume;
  const wetMortarVol = Math.max(0, wallVolumeCuM - bricksActualTotalVol);
  const dryMortarVol = wetMortarVol * 1.33; // 1.33 dry factor for mortar

  // Mortar ratio 1:5 standard
  const cementVol = (1 / 6) * dryMortarVol;
  const sandVol = (5 / 6) * dryMortarVol;
  const cementBags = (cementVol * 1440) / 50;

  return {
    netWallAreaSqM: Math.round(netWallArea * 100) / 100,
    wallVolumeCuM: Math.round(wallVolumeCuM * 100) / 100,
    bricksNeeded: bricksWithWastage,
    cementBags50kg: Math.ceil(cementBags * 10) / 10,
    sandCuFt: Math.round(sandVol * 35.3147 * 10) / 10,
    mortarVolumeCuM: Math.round(wetMortarVol * 100) / 100
  };
}

export function calculateTiles(
  roomLength: number,
  roomWidth: number,
  tileLengthCm: number = 60,
  tileWidthCm: number = 60,
  groutJointMm: number = 2,
  tilesPerBox: number = 4,
  pricePerBox: number = 0,
  wastagePercent: number = 10,
  unit: 'meters' | 'feet' = 'meters'
) {
  // Normalize room area to sq meters
  const roomAreaSqM = unit === 'meters' ? roomLength * roomWidth : (roomLength * roomWidth) * 0.092903;
  const roomAreaSqFt = roomAreaSqM * 10.7639;

  // Tile dimensions in meters
  const tileLM = (tileLengthCm + groutJointMm / 10) / 100;
  const tileWM = (tileWidthCm + groutJointMm / 10) / 100;
  const singleTileAreaSqM = tileLM * tileWM;

  const rawTileCount = roomAreaSqM / singleTileAreaSqM;
  const tilesWithWastage = Math.ceil(rawTileCount * (1 + wastagePercent / 100));
  const boxesNeeded = Math.ceil(tilesWithWastage / Math.max(1, tilesPerBox));
  const totalCost = boxesNeeded * pricePerBox;

  return {
    roomAreaSqM: Math.round(roomAreaSqM * 100) / 100,
    roomAreaSqFt: Math.round(roomAreaSqFt * 100) / 100,
    singleTileAreaSqM: Math.round(singleTileAreaSqM * 10000) / 10000,
    tilesNeeded: tilesWithWastage,
    boxesNeeded,
    totalCost: Math.round(totalCost * 100) / 100
  };
}

export function calculatePlaster(
  areaSqM: number,
  thicknessMm: number = 12,
  mixRatio: { cement: number; sand: number } = { cement: 1, sand: 4 },
  wastagePercent: number = 10
) {
  const wetVolume = areaSqM * (thicknessMm / 1000);
  const wetVolWithWaste = wetVolume * (1 + wastagePercent / 100);
  // Dry volume factor for mortar is 1.33
  const dryVolume = wetVolWithWaste * 1.33;

  const totalParts = mixRatio.cement + mixRatio.sand;
  const cementVol = (mixRatio.cement / totalParts) * dryVolume;
  const sandVol = (mixRatio.sand / totalParts) * dryVolume;

  const cementKg = cementVol * 1440;
  const cementBags = cementKg / 50;

  return {
    areaSqM: Math.round(areaSqM * 100) / 100,
    plasterVolumeCuM: Math.round(wetVolWithWaste * 1000) / 1000,
    cementBags50kg: Math.ceil(cementBags * 10) / 10,
    cementKg: Math.round(cementKg),
    sandCuM: Math.round(sandVol * 1000) / 1000,
    sandCuFt: Math.round(sandVol * 35.3147 * 10) / 10
  };
}

export function calculateRoofing(
  roofBaseLengthFeet: number,
  roofBaseWidthFeet: number,
  pitchSlopeOver12: number = 4, // 4/12 pitch
  overhangInches: number = 12,
  wastagePercent: number = 10
) {
  // Overhang adjustment in feet
  const overhangFeet = overhangInches / 12;
  const adjustedLength = roofBaseLengthFeet + 2 * overhangFeet;
  const adjustedWidth = roofBaseWidthFeet + 2 * overhangFeet;

  // Base flat area
  const flatAreaSqFt = adjustedLength * adjustedWidth;

  // Pitch multiplier: sqrt(1 + (pitch/12)^2)
  const pitchMultiplier = Math.sqrt(1 + Math.pow(pitchSlopeOver12 / 12, 2));
  const pitchedAreaSqFt = flatAreaSqFt * pitchMultiplier;
  const totalAreaWithWaste = pitchedAreaSqFt * (1 + wastagePercent / 100);

  // Roofing squares (1 square = 100 sq ft)
  const roofingSquares = totalAreaWithWaste / 100;
  // 3 bundles of asphalt shingles per square
  const shingleBundles = Math.ceil(roofingSquares * 3);
  // Underlayment rolls: standard 1 roll covers ~4 squares (400 sq ft)
  const underlaymentRolls = Math.ceil(roofingSquares / 4);
  // Ridge cap length
  const ridgeLengthFeet = adjustedLength;

  return {
    flatAreaSqFt: Math.round(flatAreaSqFt),
    pitchMultiplier: Math.round(pitchMultiplier * 1000) / 1000,
    pitchedAreaSqFt: Math.round(pitchedAreaSqFt),
    roofingSquares: Math.round(roofingSquares * 10) / 10,
    shingleBundles,
    underlaymentRolls,
    ridgeLengthFeet: Math.round(ridgeLengthFeet)
  };
}

export function calculateStaircaseGeometry(
  totalRiseInches: number,
  targetRiserInches: number = 7.0,
  targetTreadInches: number = 11.0
) {
  const stepsCount = Math.round(totalRiseInches / Math.max(4, targetRiserInches));
  const actualRiserHeight = totalRiseInches / stepsCount;
  const numberOfTreads = stepsCount - 1;
  const totalRunInches = numberOfTreads * targetTreadInches;

  // Incline angle: arctan(riser / tread)
  const angleRad = Math.atan(actualRiserHeight / targetTreadInches);
  const angleDegrees = (angleRad * 180) / Math.PI;

  // Stringer length = sqrt(totalRise^2 + totalRun^2)
  const stringerLengthInches = Math.sqrt(
    Math.pow(totalRiseInches, 2) + Math.pow(totalRunInches, 2)
  );

  // Blondel's Rule / Comfort check: 2 * Riser + Tread should be between 24 and 25 inches
  const blondelScore = 2 * actualRiserHeight + targetTreadInches;
  const isComfortable = blondelScore >= 24 && blondelScore <= 25.5;

  return {
    totalRiseInches,
    stepsCount,
    actualRiserInches: Math.round(actualRiserHeight * 100) / 100,
    numberOfTreads,
    actualTreadInches: targetTreadInches,
    totalRunInches: Math.round(totalRunInches * 10) / 10,
    totalRunFeet: Math.round((totalRunInches / 12) * 10) / 10,
    stringerLengthFeet: Math.round((stringerLengthInches / 12) * 10) / 10,
    angleDegrees: Math.round(angleDegrees * 10) / 10,
    blondelScore: Math.round(blondelScore * 10) / 10,
    isComfortable
  };
}

export function estimateConstructionCost(
  builtUpAreaSqFt: number,
  qualityTier: 'economy' | 'standard' | 'premium' = 'standard',
  customRatePerSqFt?: number
) {
  // Approximate baseline benchmark rates per sq ft (can be overridden)
  const benchmarkRates = {
    economy: 140,
    standard: 200,
    premium: 320
  };

  const rate = customRatePerSqFt && customRatePerSqFt > 0 ? customRatePerSqFt : benchmarkRates[qualityTier];
  const totalCost = builtUpAreaSqFt * rate;

  // Professional percentage distribution of residential construction
  const breakdown = {
    structureAndGrey: totalCost * 0.45,
    finishingAndFlooring: totalCost * 0.15,
    plumbingAndSanitary: totalCost * 0.10,
    electricalAndHvac: totalCost * 0.12,
    woodworkDoorsWindows: totalCost * 0.12,
    contingencyReserve: totalCost * 0.06
  };

  return {
    builtUpAreaSqFt,
    ratePerSqFt: rate,
    totalEstimatedCost: Math.round(totalCost),
    breakdown: {
      structureAndGrey: Math.round(breakdown.structureAndGrey),
      finishingAndFlooring: Math.round(breakdown.finishingAndFlooring),
      plumbingAndSanitary: Math.round(breakdown.plumbingAndSanitary),
      electricalAndHvac: Math.round(breakdown.electricalAndHvac),
      woodworkDoorsWindows: Math.round(breakdown.woodworkDoorsWindows),
      contingencyReserve: Math.round(breakdown.contingencyReserve)
    }
  };
}
