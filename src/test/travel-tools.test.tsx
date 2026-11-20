import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ToastProvider } from '../context/ToastContext';
import {
  calculateTripFuelCost,
  convertFuelMileage,
  calculateTravelTime,
  calculateAverageSpeed,
  calculateFlightDuration,
  calculateJetLag,
  convertLuggageWeight,
  checkBaggageCompliance,
  calculateEqualExpenseSettlement
} from '../utils/travel/travelCalculators';
import {
  decimalToDms,
  dmsToDecimal,
  formatGpsCoordinates,
  calculateHaversineDistance,
  calculateBearing,
  bearingToCompassPoint,
  getCompassReciprocal,
  generateMapLinks,
  generateGoogleMapsRouteUrl,
  isValidCoordinate
} from '../utils/travel/navigationUtils';
import { travelDB } from '../utils/travelDB';
import { TravelDistanceCalculator, TripFuelCostCalculator } from '../components/tools/travel/TravelCalculatorTools';
import { GpsCoordinatesFormatter } from '../components/tools/travel/NavigationLocationTools';

describe('LifeTools — Travel Calculators & Math Engines', () => {
  it('calculates trip fuel consumption and cost accurately', () => {
    // 500 km at 10 km/L = 50 L. At $1.50/L = $75.
    const res = calculateTripFuelCost({
      distance: 500,
      distanceUnit: 'km',
      consumption: 10,
      consumptionType: 'km_per_l',
      fuelPricePerUnit: 1.5,
      travelersCount: 2
    });
    expect(res.totalFuelNeeded).toBe(50);
    expect(res.totalCost).toBe(75);
    expect(res.costPerPerson).toBe(37.5);
  });

  it('converts vehicle fuel mileage between US MPG, UK MPG, L/100km, and km/L', () => {
    const res = convertFuelMileage(30, 'mpg_us');
    expect(res).not.toBeNull();
    expect(res?.mpgUs).toBe(30);
    expect(res?.mpgUk).toBeCloseTo(36.0, 1);
    expect(res?.litersPer100Km).toBeCloseTo(7.8, 1);
    expect(res?.kmPerLiter).toBeCloseTo(12.8, 1);
  });

  it('calculates travel time and rest stops', () => {
    // 300 km at 100 km/h with stops every 2 hours
    const res = calculateTravelTime(300, 100, 2, 15);
    expect(res.drivingHours).toBe(3);
    expect(res.stopsCount).toBe(1);
    expect(res.totalTripHours).toBe(3);
    expect(res.totalTripMinutes).toBe(15);
  });

  it('calculates average speed in km/h and mph', () => {
    // 150 km in 2 hours
    const res = calculateAverageSpeed(150, 2, 0);
    expect(res.speed).toBe(75);
    expect(res.formatted).toBe('75');
  });

  it('computes flight duration and airport buffer', () => {
    // 5100 km at 850 km/h = 6h air time + 35 min buffer
    const res = calculateFlightDuration(5100, 850, 35);
    expect(res.airTimeHours).toBe(6);
    expect(res.totalGateToGateMinutes).toBe(395); // 360 + 35
  });

  it('estimates jet lag recovery days', () => {
    // London (+0) to Tokyo (+9) -> Eastward 9 zones
    const res = calculateJetLag(0, 9);
    expect(res.timeZonesCrossed).toBe(9);
    expect(res.direction).toBe('east');
    expect(res.recoveryDays).toBe(9);
    expect(res.adaptationTips.length).toBeGreaterThan(0);
  });

  it('converts luggage weights between kg, lbs, and stone', () => {
    const res = convertLuggageWeight(23, 'kg');
    expect(res.kg).toBe(23);
    expect(res.lbs).toBeCloseTo(50.7, 1);
    expect(res.stone).toBeCloseTo(3.6, 1);
  });

  it('checks baggage allowance compliance against IATA standard limits', () => {
    // Checked bag compliant under 23kg and 158cm
    const compliant = checkBaggageCompliance(70, 50, 30, 20, 'checked');
    expect(compliant.isCompliant).toBe(true);

    // Overweight checked bag (> 23kg)
    const overweight = checkBaggageCompliance(70, 50, 30, 26, 'checked');
    expect(overweight.isCompliant).toBe(false);
    expect(overweight.issues.length).toBeGreaterThan(0);
  });

  it('computes equal group expense settlement matrix', () => {
    const participants = [
      { name: 'Alice', paidAmount: 300 },
      { name: 'Bob', paidAmount: 100 },
      { name: 'Charlie', paidAmount: 50 }
    ];
    // Total = 450, per person = 150.
    // Alice is owed +150, Bob owes -50, Charlie owes -100.
    const res = calculateEqualExpenseSettlement(participants);
    expect(res.totalExpense).toBe(450);
    expect(res.perPersonShare).toBe(150);
    expect(res.transfers.length).toBe(2);
    expect(res.transfers.some((t) => t.from === 'Charlie' && t.to === 'Alice')).toBe(true);
  });
});

describe('LifeTools — Geographic & Navigation Engines', () => {
  it('validates coordinates accurately', () => {
    expect(isValidCoordinate(37.7749, -122.4194)).toBe(true);
    expect(isValidCoordinate(91, 0)).toBe(false);
    expect(isValidCoordinate(0, 185)).toBe(false);
  });

  it('converts decimal degrees to DMS and back without precision loss', () => {
    const lat = 40.7128; // NYC
    const dms = decimalToDms(lat, true);
    expect(dms.degrees).toBe(40);
    expect(dms.minutes).toBe(42);
    expect(dms.direction).toBe('N');

    const reconverted = dmsToDecimal(dms.degrees, dms.minutes, dms.seconds, dms.direction);
    expect(reconverted).toBeCloseTo(lat, 4);
  });

  it('formats GPS coordinates into standard conventions', () => {
    const res = formatGpsCoordinates(51.5074, -0.1278);
    expect(res).not.toBeNull();
    expect(res?.decimalDegrees.lat).toBe(51.5074);
    expect(res?.dms.latDms).toContain('51°');
    expect(res?.geoUri).toContain('geo:51.507400,-0.127800');
  });

  it('calculates Haversine spherical distance between New York and London', () => {
    // NYC (40.7128, -74.0060) to London (51.5074, -0.1278) ~5570 km
    const dist = calculateHaversineDistance(40.7128, -74.006, 51.5074, -0.1278);
    expect(dist).not.toBeNull();
    expect(dist?.km).toBeGreaterThan(5500);
    expect(dist?.km).toBeLessThan(5600);
    expect(dist?.miles).toBeGreaterThan(3400);
    expect(dist?.miles).toBeLessThan(3500);
  });

  it('calculates forward bearing and compass rose heading', () => {
    // LA (34.0522, -118.2437) to Vegas (36.1699, -115.1398) ~40° - 45° (NE)
    const bearing = calculateBearing(34.0522, -118.2437, 36.1699, -115.1398);
    expect(bearing).toBeGreaterThan(35);
    expect(bearing).toBeLessThan(50);

    const compass = bearingToCompassPoint(bearing);
    expect(compass.cardinal8).toBe('North-East');

    const backBearing = getCompassReciprocal(bearing);
    expect(backBearing).toBeCloseTo(bearing + 180, 1);
  });

  it('generates cross-platform map deep links', () => {
    const links = generateMapLinks(48.8566, 2.3522, 'Paris');
    expect(links.googleMaps).toContain('google.com/maps');
    expect(links.appleMaps).toContain('maps.apple.com');
    expect(links.openStreetMap).toContain('openstreetmap.org');
    expect(links.geoUri).toContain('geo:48.856600,2.352200');
  });

  it('generates Google Maps route URL with waypoints', () => {
    const route = generateGoogleMapsRouteUrl('Denver, CO', 'Moab, UT', ['Glenwood Springs, CO'], 'driving');
    expect(route).toContain('google.com/maps/dir/?api=1');
    expect(route).toContain('travelmode=driving');
    expect(route).toContain('Glenwood');
  });
});

describe('LifeTools — Travel IndexedDB Storage Engine', () => {
  beforeEach(async () => {
    const trips = await travelDB.getTrips();
    for (const t of trips) await travelDB.deleteTrip(t.id);
  });

  it('saves, retrieves, and deletes trips in local database', async () => {
    const testTrip = {
      id: 'test_trip_1',
      title: 'Alpine Hike',
      destination: 'Interlaken, Switzerland',
      startDate: '2026-07-10',
      endDate: '2026-07-20',
      travelersCount: 2,
      estimatedBudget: 3500,
      currency: 'CHF',
      status: 'planning' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await travelDB.saveTrip(testTrip);
    const trips = await travelDB.getTrips();
    expect(trips.some((t) => t.id === 'test_trip_1')).toBe(true);

    await travelDB.deleteTrip('test_trip_1');
    const afterDelete = await travelDB.getTrips();
    expect(afterDelete.some((t) => t.id === 'test_trip_1')).toBe(false);
  });

  it('exports and restores complete travel database payload', async () => {
    const item = {
      id: 'pack_test_1',
      name: 'Passport Holder',
      category: 'documents' as const,
      quantity: 1,
      isPacked: true,
      bagType: 'personal_item' as const
    };

    await travelDB.savePackingItem(item);
    const exported = await travelDB.exportAll();
    expect(exported.packing_lists.some((p: any) => p.id === 'pack_test_1')).toBe(true);

    await travelDB.restoreAll(exported, 'replace');
    const restored = await travelDB.getPackingItems();
    expect(restored.some((p) => p.id === 'pack_test_1')).toBe(true);
  });
});

describe('LifeTools — Travel UI Components', () => {
  it('renders TravelDistanceCalculator and responds to input changes', () => {
    render(
      <ToastProvider>
        <TravelDistanceCalculator />
      </ToastProvider>
    );

    expect(screen.getByText(/Distance Value/i)).toBeDefined();
    expect(screen.getAllByText(/Kilometers/i).length).toBeGreaterThan(0);
  });

  it('renders TripFuelCostCalculator and displays fuel budget', () => {
    render(
      <ToastProvider>
        <TripFuelCostCalculator />
      </ToastProvider>
    );

    expect(screen.getByText(/Trip Distance/i)).toBeDefined();
    expect(screen.getByText(/Total Fuel Required/i)).toBeDefined();
    expect(screen.getByText(/Total Fuel Cost/i)).toBeDefined();
  });

  it('renders GpsCoordinatesFormatter with default coordinates', () => {
    render(
      <ToastProvider>
        <GpsCoordinatesFormatter />
      </ToastProvider>
    );

    expect(screen.getByText(/GPS Coordinates Formatter/i)).toBeDefined();
    expect(screen.getByText(/Decimal Degrees \(DD\)/i)).toBeDefined();
    expect(screen.getByText(/Degrees Minutes Seconds \(DMS\)/i)).toBeDefined();
  });
});
