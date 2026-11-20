# LifeTools — Home, Household & Property Utilities Technical Guide

## 🏡 Overview & Purpose

The **Home, Household & Property Utilities** suite (Category 20: `home`) introduces **70 specialized client-side tools** designed to simplify residential utility audits, construction estimation, household organization, maintenance scheduling, and real estate property conversions.

Every calculation and database operation runs **100% locally on the user's device** using client-side JavaScript, Web APIs, and browser IndexedDB (`lifetools_household_db`). No household inventory, financial figures, property dimensions, or maintenance schedules are ever transmitted to external servers.

---

## 🧮 1. Home Calculators (15 Tools)

### A. Electricity & Utility Bill Modeling
1. **Home Electricity Bill Estimator (`home-electricity-bill-estimator`):**
   - Progressive tiered slab calculation:
     $$\text{Total Bill} = \left( \sum_{i} \text{Units}_i \times \text{Rate}_i + \text{Fixed Charges} + \text{Fuel Surcharge} \right) \times (1 + \text{Tax Rate})$$
   - Distinguishes energy charges from fuel adjustments and municipal utility duties.
2. **Electricity Consumption Calculator (`electricity-consumption-calculator`):**
   - Whole-house energy audit:
     $$\text{Daily kWh} = \sum \frac{\text{Wattage} \times \text{Operating Hours} \times \text{Quantity}}{1000}$$
   - Computes daily, monthly (30 days), and annual (365 days) power consumption.
3. **Appliance Electricity Cost Calculator (`appliance-electricity-cost-calculator`):**
   - Single-appliance energy running cost with customizable utility price per kWh.
4. **Monthly Water Bill Estimator (`monthly-water-bill-estimator`):**
   - Models volumetric municipal water consumption with sewage treatment charges (typically 25-35% of water fees) and meter service fees.
5. **Water Consumption Calculator (`household-water-consumption-calculator`):**
   - Granular indoor/outdoor water audit tracking showers ($9.5\text{ L/min}$ standard), toilets ($6\text{ L/flush}$), laundry ($60\text{ L/load}$), dishwashing ($15\text{ L/cycle}$), and lawn irrigation.

### B. Thermal & Energy Systems
6. **LPG Gas Consumption Calculator (`lpg-gas-consumption-calculator`):**
   - Computes cylinder lifespan and daily burn:
     $$\text{Daily Burn (g)} = \text{Cooking Hours} \times \text{Active Burners} \times 150\text{ g/hr}$$
     $$\text{Estimated Lifespan (Days)} = \left\lfloor \frac{\text{Cylinder Net Weight (g)}}{\text{Daily Burn (g)}} \right\rfloor$$
7. **Solar Panel Requirement Calculator (`solar-panel-requirement-calculator`):**
   - Sizing rooftop solar PV systems:
     $$\text{Target System (kW)} = \frac{\text{Daily kWh}}{\text{Peak Sun Hours} \times \text{System Efficiency (0.80)}}$$
     $$\text{Panels Count} = \left\lceil \frac{\text{System Watts}}{\text{Panel Wattage}} \right\rceil$$
   - Computes roof space footprint ($\sim 18\text{ sq ft}$ or $1.67\text{ m}^2$ per 400W module).
8. **Solar Energy Savings Calculator (`solar-energy-savings-calculator`):**
   - Evaluates simple payback period and 25-year cumulative financial savings after net metering offsets and routine inverter maintenance.

### C. Household Connectivity & Living Expenses
9. **Home Internet Usage Calculator (`home-internet-usage-calculator`):**
   - Models data volume: 4K streaming ($7\text{ GB/hr}$), HD ($3\text{ GB/hr}$), video conferencing ($1.5\text{ GB/hr}$), and recommends minimum download speeds.
10. **Household Monthly Budget Calculator (`household-monthly-budget-calculator`):**
    - 50/30/20 balanced budget framework tailored for residential housing, utilities, food, transport, and emergency reserves.
11. **Rent Split Calculator (`household-rent-split-calculator`):**
    - Balanced roommate rent allocation:
      $$\text{Tenant Base Share} = (\text{Total Rent} - \text{Amenity Premiums}) \times \frac{\text{Room Area}}{\text{Total Apartment Area}}$$
    - Adds fixed premiums for private ensuites, balconies, and parking spots.

### D. Spatial Dimensions & Decor
12. **Room Area Calculator (`room-area-calculator`):**
    - Multi-shape floor surface area and baseboard perimeter with HVAC cooling ton recommendations ($25\text{ BTU/sq ft}$).
13. **Room Volume Calculator (`room-volume-calculator`):**
    - Cubic volume ($L \times W \times H$) and Clean Air Delivery Rate (CADR) sizing for 4 air changes per hour (ACH).
14. **Paint Quantity Calculator (`paint-quantity-calculator`):**
    - Net paintable area deducting doors ($21\text{ sq ft}$) and windows ($15\text{ sq ft}$).
    - Paint liters needed: $\frac{\text{Net Area} \times \text{Coats}}{100\text{ sq ft/L}}$.
15. **Wallpaper Calculator (`wallpaper-calculator`):**
    - Roll estimator accounting for pattern repeat vertical drop loss and 10% cutting wastage.

---

## 🏗️ 2. Construction & Renovation Calculators (15 Tools)

### A. Structural Materials
16. **Cement Calculator (`cement-calculator`):**
    - Converts concrete and mortar mix ratios to standard 50kg bags ($\text{Density} = 1440\text{ kg/m}^3$).
17. **Concrete Calculator (`concrete-calculator`):**
    - Slabs, columns, and footings. Applies the fundamental dry volume expansion factor of **1.54**:
      $$\text{Dry Volume} = \text{Wet Volume} \times 1.54$$
    - Calculates exact 50kg cement bags, sand tons, and coarse aggregate tons for M15, M20, and M25 mixes.
18. **Brick Calculator (`brick-calculator`):**
    - Wall volume minus aperture deductions. Uses nominal brick dimensions ($200 \times 100 \times 100\text{ mm}$ with $10\text{ mm}$ mortar) with 7% breakage buffer.
19. **Sand Quantity Calculator (`sand-quantity-calculator`):**
    - Converts sand between cubic feet, cubic meters, metric tons ($\text{density } 1600\text{ kg/m}^3$), and Brass units ($1\text{ Brass} = 100\text{ cu ft}$).
20. **Aggregate Calculator (`aggregate-calculator`):**
    - Coarse stone aggregate converter ($1500\text{ kg/m}^3$ bulk density).

### B. Finishes, Plaster & Roofing
21. **Tile Calculator (`tile-calculator`):**
    - Computes floor/wall tile counts, 10% cutting wastage, and total retail boxes needed.
22. **Flooring Cost Calculator (`flooring-cost-calculator`):**
    - Itemized estimate covering flooring planks, moisture underlayment, and installation labor.
23. **Wall Area Calculator (`wall-area-calculator`):**
    - Gross vertical wall area minus fenestration openings.
24. **Plaster Calculator (`plaster-calculator`):**
    - Mortar dry volume factor of **1.33**:
      $$\text{Dry Volume} = \text{Wet Volume} \times 1.33$$
    - Computes cement bags and fine sand for 12mm internal and 15-20mm external plaster.
25. **Roofing Material Calculator (`roofing-material-calculator`):**
    - Computes pitched roof area using slope pitch multiplier:
      $$\text{Pitch Multiplier} = \sqrt{1 + \left(\frac{\text{Pitch}}{12}\right)^2}$$
    - Calculates roofing squares ($100\text{ sq ft}$), 3-bundle shingle packs, and underlayment rolls.
26. **Staircase Calculator (`staircase-calculator`):**
    - Computes step counts, actual riser height, horizontal run, stringer length, and incline angle.
    - Evaluates **Blondel's Ergonomic Comfort Rule**:
      $$2 \times \text{Riser} + \text{Tread} = 24\text{ to }25.5\text{ inches}$$
27. **Door & Window Area Calculator (`door-window-area-calculator`):**
    - Architectural aperture schedule for thermal loads and fenestrations.

### C. Costing & Renovation
28. **Construction Cost Estimator (`construction-cost-estimator`):**
    - Turnkey plinth area forecast across Economy ($140/sq ft), Standard ($200/sq ft), and Luxury ($320/sq ft).
    - Itemized breakdown: Grey Structure (45%), Finishes (15%), Electrical/HVAC (12%), Woodwork (12%), Plumbing (10%), Contingency (6%).
29. **Material Cost Calculator (`construction-material-cost-calculator`):**
    - Bill of Quantities (BOQ) procurement tally for site materials.
30. **Renovation Budget Planner (`renovation-budget-planner`):**
    - Remodeling budget tracker with a mandatory 15% unexpected contingency buffer.

---

## 📋 3. Home Organization Tools (15 Tools)

31. **Household Chore Planner (`household-chore-planner`):** Room-by-room chore checklist with assignee tracking and local IndexedDB persistence.
32. **Cleaning Schedule Generator (`cleaning-schedule-generator`):** 7-day rotating zone cleaning schedule preventing weekend burnout.
33. **Daily Cleaning Checklist (`daily-cleaning-checklist`):** 15-minute daily reset checklist (kitchen counters, sinks, trash).
34. **Weekly Cleaning Planner (`weekly-cleaning-planner`):** Day-by-day deep cleaning agenda.
35. **Monthly Cleaning Planner (`monthly-cleaning-planner`):** Deep care for baseboards, exhaust fans, and appliance coils.
36. **Laundry Schedule (`laundry-schedule-planner`):** Wash day schedule with fabric-safe temperature guidelines.
37. **Grocery Inventory Manager (`grocery-inventory-manager`):** Stock manager tracking pantry, fridge, and freezer inventory with expiry warnings.
38. **Pantry Inventory Tracker (`pantry-inventory-tracker`):** Dry staples and non-perishables shelf-life tracker.
39. **Refrigerator Inventory Tracker (`refrigerator-inventory-tracker`):** Perishable food inventory to reduce food waste.
40. **Household Shopping List (`household-shopping-list`):** Interactive shopping checklist with aisle department grouping.
41. **Home Inventory Manager (`home-inventory-manager`):** Insurance asset register logging make, model, serial numbers, and replacement values.
42. **Furniture Measurement Planner (`furniture-measurement-planner`):** Verifies if bulky furniture can pass through doorways and stairwells.
43. **Room Layout Planner (`room-layout-planner`):** Walkway clearance ergonomics ($30\text{ to }36\text{ inches}$).
44. **Storage Space Calculator (`storage-space-calculator`):** Box count to self-storage unit sizing ($5\times 5$, $10\times 10$, $10\times 20$).
45. **Moving House Checklist (`moving-house-checklist`):** Chronological moving countdown (8 weeks prior to moving day).

---

## 🔧 4. Home Maintenance Tools (10 Tools)

46. **Home Maintenance Tracker (`home-maintenance-tracker`):** Preventative maintenance calendar and service provider cost ledger.
47. **Appliance Maintenance Reminder (`appliance-maintenance-reminder`):** Dryer vent cleaning, defroster checks, and dishwasher filter cleans.
48. **AC Service Reminder (`ac-service-reminder`):** 30-day mesh filter washing and 6-month chemical coil servicing.
49. **Home Equipment Maintenance Tracker (`home-equipment-maintenance-tracker`):** Generator runtime hours, lawn mower blade sharpening, and oil changes.
50. **Plumbing Maintenance Checklist (`plumbing-maintenance-checklist`):** P-trap inspections, shutoff valve testing, and water heater flushing.
51. **Electrical Maintenance Checklist (`electrical-maintenance-checklist`):** GFCI breaker testing, smoke detector battery replacement.
52. **Water Tank Cleaning Reminder (`water-tank-cleaning-reminder`):** Semi-annual disinfection and sediment removal scheduler for water storage tanks.
53. **Filter Replacement Reminder (`filter-replacement-reminder`):** Log for HVAC, refrigerator water, RO, and range hood filters.
54. **Home Repair Expense Tracker (`home-repair-expense-tracker`):** Repair ledger with contractor contacts and capital improvement tags.
55. **Warranty Expiry Reminder (`warranty-expiry-reminder`):** Appliance purchase dates and warranty claim deadlines.

---

## 🏛️ 5. Property & Rental Tools (15 Tools)

### A. Regional Land & Area Conversions
56. **Property Area Converter (`property-area-converter`):**
    - Seamless real estate converter across Sq Feet, Sq Meters, Sq Yards, Acres, Hectares, Kanal, Marla, Bigha, Guntha, Cent, Ground.
    - **Configurable Marla Standards:**
      - *Modern / LDA Standard:* $1\text{ Marla} = 225\text{ sq ft}$ ($1\text{ Kanal} = 4,500\text{ sq ft}$).
      - *Traditional Revenue Cadastral:* $1\text{ Marla} = 272.25\text{ sq ft}$ ($1\text{ Kanal} = 5,445\text{ sq ft}$, $8\text{ Kanals} = 1\text{ Acre}$).
      - *Commercial Standard:* $1\text{ Marla} = 200\text{ sq ft}$.
      - *Custom Standard:* User-defined square feet per Marla.
57. **Square Feet to Square Meter Converter (`square-feet-to-square-meter-converter`):** High-precision bidirectional converter ($1\text{ m}^2 = 10.7639\text{ sq ft}$).
58. **Acre to Kanal Converter (`acre-to-kanal-converter`):** Configurable land conversion between Acres and Kanals.
59. **Kanal to Marla Converter (`kanal-to-marla-converter`):** Universal $1\text{ Kanal} = 20\text{ Marlas}$ conversion.
60. **Marla to Square Feet Converter (`marla-to-square-feet-converter`):** Marla to sq ft with scheme comparison.

### B. Property Valuation, Taxes & Rentals
61. **Property Price Calculator (`property-price-calculator`):** Real estate pricing incorporating corner plot (+10%), park-facing (+5%), and development fees.
62. **Property Registration Expense Estimator (`property-registration-expense-estimator`):** Closing costs breakdown (Stamp Duty, Registration Fee, Mutation Tax, Legal Fees).
63. **Rental Yield Calculator (`rental-yield-calculator`):**
    - Gross Yield: $\frac{\text{Annual Gross Rent}}{\text{Purchase Price}} \times 100$
    - Net Yield: $\frac{\text{Effective Rent} - \text{Operating Expenses}}{\text{Purchase Price}} \times 100$
64. **Monthly Rent Splitter (`monthly-rent-splitter`):** Equal rent and utility share calculator.
65. **Security Deposit Calculator (`security-deposit-calculator`):** Lease deposits (1-2 months rent), pet deposits, and key deposits.

### C. Financing, Affordability & Investment
66. **Mortgage/EMI Calculator (`property-mortgage-calculator`):**
    - Full real estate mortgage engine calculating Principal, Interest, Property Taxes, Homeowners Insurance, and PMI (PITI).
67. **Home Loan Affordability Calculator (`home-loan-affordability-calculator`):**
    - Maximum purchase price based on Front-End (28%) and Back-End (36%) Debt-to-Income (DTI) rules.
68. **Property Investment Calculator (`property-investment-calculator`):**
    - Net Operating Income (NOI), Capitalization Rate (Cap Rate), Cash-on-Cash Return, and net monthly cash flow.
69. **Rent vs Buy Calculator (`rent-vs-buy-calculator`):**
    - Long-term comparative wealth analysis over 5 to 30 years factoring property appreciation, rent inflation, mortgage amortization, and opportunity cost of investing down payment.
70. **Property Expense Tracker (`property-expense-tracker`):**
    - Real estate ledger logging mortgage payments, HOA dues, taxes, insurance, and utilities.

---

## 💾 6. Local Storage & Universal Backup Integration

All user-generated household data is stored in the client-side IndexedDB database **`lifetools_household_db`** (Version 1):
- `chores`: Household chore plans and completion logs.
- `inventories`: Groceries, pantry items, fridge stock, and home insurance assets.
- `shopping_lists`: Household shopping items with check-off statuses.
- `maintenance_records`: Preventative maintenance tasks and service logs.
- `reminders`: AC service, water tank cleaning, and filter replacement schedules.
- `repair_expenses`: Home repair expense records.
- `property_expenses`: Property operating expenditures.
- `property_records`: Property asset profiles.

### Universal Backup & Restore
- The database is fully integrated into the Universal Backup & Restore system (`#/backup`).
- Supports JSON, all-in-one ZIP archives, and PBKDF2 / AES-256-GCM encryption.
- Both **Merge Mode** (safe ID de-duplication) and **Replace Mode** (clean restore) are supported.
