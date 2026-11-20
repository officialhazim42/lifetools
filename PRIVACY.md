# LifeTools — Privacy Manifesto & Data Protection Policy

**Last Updated:** November 2026  
**Status:** In Effect  
**Platform:** LifeTools (Designed & Developed by [@officialhazim42](https://github.com/officialhazim42))

---

## 🛡️ 1. Fundamental Principle: Privacy by Architecture

Most software platforms treat user privacy as a set of legal promises written in complex legalese. At **LifeTools**, privacy is an immutable architectural constraint:

> **If we do not collect, transmit, or store your data on our servers, your data can never be breached, intercepted, leaked, or sold.**

All 633 digital utility tools run **100% locally on your device**.

---

## 🚫 2. What LifeTools NEVER Does

1. **NO File Uploads:** Uploaded photos, audio recordings, microphone streams, video files, CSV files, PDF documents, vCard archives, and text files are read into browser memory via HTML5 `FileReader` and manipulated via HTML5 `Canvas`, `Web Audio API`, and `pdf-lib`. No bytes are ever transmitted over the network.
2. **NO Financial Credential Collection:** In the **UPI Payment QR Generator**, LifeTools NEVER requests, stores, or processes sensitive banking credentials — including **UPI PINs**, **ATM PINs**, **OTPs**, **CVVs**, debit/credit card numbers, net banking passwords, or bank login tokens. UPI QR generation is strictly used to RECEIVE funds into your bank account.
3. **NO Mandatory Accounts:** You will never be asked for an email address, password, phone number, or social login to unlock any tool.
4. **NO Ad-Tracking Pixels:** There are no Facebook Pixels, Google Tag Manager scripts, marketing trackers, or third-party behavioral scripts.
5. **NO Server-Side Logging:** Because the platform is distributed as static web assets, there are no backend APIs to record user inputs, financial budgets, notes, calculation queries, contacts, or generated passwords.
6. **NO Paywalls or Hidden Fees:** All 633 tools are completely free to use.

---

## 💾 3. What Is Stored on Your Device

To provide a seamless, persistent offline user experience, LifeTools stores preferences and personal productivity records across three local browser storage systems:

### A. LocalStorage (Lightweight Preferences)
1. **Application Settings (`lifetools-settings-v1`):** Complete user-configured settings profile (theme mode, font scaling, density, motion, accent color, date/time/number formats, currencies, notifications, and default pages).
2. **Theme Preference (`lifetools-theme`):** Stores your selected theme (`dark` or `light`).
3. **Favorites (`lifetools-favorites`):** An array of string IDs representing tools you have bookmarked. Starts completely empty (0 items) until you explicitly bookmark a tool.
4. **Recently Used (`lifetools-recent`):** A list of recently visited tools and timestamps. Starts completely empty until you use a tool.
5. **Standalone Utility Records:** Items created in individual everyday utilities (e.g. quick checklists, water logs, vehicle logs).

### B. IndexedDB (`lifetools_workspace_db` — My Workspace)
For the dedicated **My Workspace** hub (`#/workspace`), structured data is maintained securely inside browser **IndexedDB**:
1. **My Notes (`notes` store):** Private notes, markdown content, tags, color flags, and pin statuses.
2. **My Tasks (`tasks` store):** Personal to-dos, deadlines, priority markers, and completion records.
3. **My Expenses (`expenses` store):** Local spending ledger, transaction amounts (in INR), categories, and payment methods.
4. **My Habits (`habits` store):** Daily habit completion dates, current streaks, and weekly targets.
5. **My Goals (`goals` store):** Long-term goals, target dates, and completion progress percentages.
6. **My Calendar (`events` store):** Local calendar events, reminders, deadlines, and task milestones.

**Zero Cloud Transmission:** LifeTools has no server databases or cloud sync workers. All notes, expenses, goals, and tasks exist solely within your local device's IndexedDB partition.

### C. IndexedDB (`lifetools_communication_db` — Communication & Social Utilities)
For the **Communication & Social Utilities** suite, sensitive relationship and communication data is kept strictly inside browser **IndexedDB**:
1. **Important Contacts (`contacts` store):** Personal address book entries, VIP contacts, emergency ICE numbers, and relationship tags.
2. **Message Drafts (`drafts` store):** In-progress private messages and sensitive correspondence across email, SMS, WhatsApp, and LinkedIn channels.
3. **Reminders (`reminders` store):** Birthdays, anniversaries, and follow-up commitments with relative countdown dates.
4. **Communication Notes (`notes` store):** Interaction logs, call notes, and conversation summaries.
5. **Meeting Follow-ups (`meeting_followups` store):** Action item checklists, meeting attendees, and agreed deliverables.
6. **Quick Replies (`quick_replies` store):** Canned personal snippets and templates.

**100% Client-Side Confidentiality:** Neither phone numbers, contact names, email drafts, nor personal notes ever touch an external network.

### D. IndexedDB (`lifetools_health_db` — Health, Fitness & Wellness Records)
For the **Health, Fitness & Wellness** suite, confidential biometric and medical organization data is kept strictly inside browser **IndexedDB**:
1. **Blood Pressure & Glucose Records (`blood_pressure_logs`, `blood_sugar_logs`):** Systolic/diastolic readings, pulse, blood glucose levels, and AHA/ADA staging classifications.
2. **Medication & Treatment Plans (`medications`):** Prescription schedules, dosages, frequencies, and administration food notes.
3. **Medical Appointments & Clinical Reports (`appointments`, `medical_reports`):** Doctor consultations, specialist clinic locations, lab test results, and radiology notes.
4. **Physical Progress & Journal (`weight_logs`, `body_measurements`, `health_journal`, `health_notes`):** Body composition logs, circumference measurements, symptom observations, and doctor questions.
5. **Emergency Medical Profile (`emergency_cards`):** Printable ICE wallet profile containing blood type, chronic conditions, critical allergies, and emergency contacts.

**Zero Cloud Transmission:** Biometric measurements, medication schedules, and clinical notes are never uploaded, logged, or processed by any external server.

### E. IndexedDB (`lifetools_travel_db` — Travel, Navigation & Planning)
For the **Travel, Navigation & Planning** suite, personal journeys, packing checklists, and travel documents are kept strictly inside browser **IndexedDB**:
1. **Trip Plans & Itineraries (`trips`, `itineraries`):** Destination details, budgets, daily itinerary timelines, departure/arrival schedules, and multi-city route waypoints.
2. **Packing Lists (`packing_lists`):** Categorized packing checklists, luggage organization, and weight tracking items.
3. **Travel Documents & Reminders (`travel_documents`):** Passport details, expiry countdowns, visa status, and travel insurance policy records.
4. **Hotel & Flight Organizers (`hotel_bookings`, `flight_records`):** Confirmation codes, accommodation addresses, check-in dates, flight numbers, terminals, and gate details.
5. **Travel Expenses & Journals (`travel_expenses`, `travel_journal`):** Trip transaction logs, currency records, expense categories, journal entries, and trip retrospective summaries.
6. **Emergency Travel Profile (`emergency_cards`):** Printable travel emergency card with embassy contacts, emergency assistance phone numbers, blood type, and travel insurer emergency numbers.

**100% Private & Device-Local:** No itinerary, passport number, flight reservation, or travel expense is ever transmitted to airlines, booking engines, or external marketing brokers.

### F. IndexedDB (`lifetools_household_db` — Home, Household & Property Records)
For the **Home, Household & Property Utilities** suite, personal chores, home inventories, maintenance logs, and property details are kept strictly inside browser **IndexedDB**:
1. **Household Chores & Cleaning Agendas (`chores`):** Task allocations, daily/weekly/monthly frequencies, and completion statuses.
2. **Pantry, Grocery & Home Asset Inventories (`inventories`):** Food expiration dates, stock levels, household appliances, serial numbers, and replacement values.
3. **Household Shopping Lists (`shopping_lists`):** Interactive supplies lists, price estimations, and item strike-throughs.
4. **Maintenance Logs & Reminders (`maintenance_records`, `reminders`):** Preventative HVAC, plumbing, electrical, and appliance service logs, water tank cleaning reminders, and warranty expirations.
5. **Repair & Property Expenses (`repair_expenses`, `property_expenses`):** Contractor expenses, material costs, property taxes, HOA fees, insurance, and mortgage interest logs.
6. **Property Records (`property_records`):** Land parcels, plot dimensions, regional units, and rental agreements.

**Zero Cloud Transmission:** Household inventories, repair contractor receipts, property square footages, and mortgage calculations never leave your local device.

### G. Universal Backup & Cryptographic Custody System (`#/backup`)
LifeTools features an enterprise-grade Universal Backup & Restore System allowing users to take 100% self-sovereign custody of all application data:
1. **Zero External Transmission:** All backup assembly, compression, hashing, and encryption occur in-memory on the client device.
2. **Standard Formats:** Data can be exported as standard JSON, all-in-one ZIP packages (built with a dependency-free pure TypeScript PKWARE engine), tabular CSV spreadsheets, or human-readable plain text markdown.
3. **Optional Web Crypto AES-256-GCM Encryption:** Users can encrypt their archives using PBKDF2 (100,000 rounds, SHA-256) and AES-256-GCM. Because keys are derived entirely in the browser and never sent to a server, **forgotten passwords cannot be recovered by anyone**.
4. **Pre-Restore Integrity Validation:** All imported backup files undergo cryptographic SHA-256 checksum verification and structural analysis before applying any changes to local databases.
5. **Safe Merge Conflict Resolution:** In Merge mode, duplicate IDs are automatically re-keyed to preserve both existing user data and incoming restored data without data loss.

### How to Clear or Export Your Data
- **Smart Settings Center (`#/settings/privacy`):** Dedicated Privacy & Security center with granular deletion controls: Clear Favorites, Clear Recently Used, Clear Local Notes, and Clear Entire Workspace. All destructive actions require explicit user confirmation.
- **Unified Personal Data Export:** Download a complete, portable JSON archive bundling your settings, favorites, recent tools, notes, tasks, expenses, habits, goals, and calendar events.
- **My Workspace Backups:** Includes a dedicated **Export Backup** tool producing a clean, unencrypted or portable JSON archive of your workspace.
- **Selective Export:** Choose to export all data or individual domains (e.g. only expenses or only tasks).
- **Validation Engine:** Built-in cryptographic and schema verification ensures imported backup files are authentic and free from malformed payloads.
- **Purge & Reset:** Granular reset buttons allow you to wipe individual stores or clear all workspace data permanently with a single click.
- You can also clear all site data and IndexedDB databases at any time through your browser's standard privacy settings.

---

## 🔒 4. Tool-Specific Security Details

### Document & PDF Processing
When you merge, split, compress, or inspect PDFs and CSVs, files are parsed locally via `pdf-lib` and browser memory streams. When you close the browser tab, the memory is discarded.

### QR Code Generators & Custom Logo Uploads
In the URL QR Generator and related QR tools, user-uploaded logo graphics (PNG, JPG, WebP) are processed 100% locally:
- **Zero Server Uploads:** Images are decoded directly into browser memory using HTML5 `FileReader` and drawn onto the client-side canvas. No images or logos are ever transmitted over the network or saved to remote cloud storage.
- **Immediate Resource Cleanup:** Object URLs created for downloads are revoked immediately upon use (`URL.revokeObjectURL`). No uploaded logos are persisted after page unload.
- **Offline Scannability Verification:** Scannability checks are executed purely in client-side JavaScript using `jsQR` without contacting external scanning or analysis services.

### Media Studio (Images, Audio, Video & Animation)
All 70 Media Studio utilities process media strictly within device memory:
- **Zero Server Processing:** Uploaded images, audio tracks, microphone streams, and video clips are decoded, rendered, and manipulated entirely through browser APIs (`HTML5 Canvas 2D`, `Web Audio API`, `AudioContext`, and pure TypeScript PCM WAV / GIF89a LZW bitstream encoders).
- **Audio & Microphone Security:** Microphone capture in the Audio Recorder uses `navigator.mediaDevices.getUserMedia` strictly upon explicit user interaction. Microphone tracks are terminated immediately when recording ends. Raw audio never leaves local memory.
- **Memory Safety & URL Revocation:** Preview and download object URLs are systematically revoked using `URL.revokeObjectURL(url)` to prevent memory leaks.
- **Zero Telemetry:** No media thumbnails, frame extracts, or audio samples are ever logged or reported to any analytics or server endpoint.

### Text Encryption & Decryption
Text encryption tools use the browser's native **Web Crypto API (`crypto.subtle`)** with authenticated **AES-256-GCM** encryption and PBKDF2 key derivation. Your secret password and plaintext never leave your machine.

### Passwords & Cryptographic Hashes
- **Password Generator & PIN Generator:** Uses `window.crypto.getRandomValues()` to generate high-entropy random characters on your device.
- **Hashes (SHA-256, SHA-512, MD5):** Computations run in your browser engine. Your input text or uploaded files are never broadcasted across the web.

### Financial Tools
All calculators, budget planners, denomination cash counters, and expense trackers execute pure local arithmetic. No banking credentials, account numbers, or PAN/SSN details are ever requested or stored.

### Health, Fitness & Clinical Organization Utilities
All 70 Health, Fitness & Wellness utilities run purely within client browser memory and local IndexedDB:
- **Informational & Non-Diagnostic:** Tools provide educational estimates (BMI, BMR, TDEE, Body Fat, Ideal Weight, WHtR, WHR, Hydration, Protein, Naegele's due date, and Heart Rate Zones) and do not formulate clinical diagnoses.
- **Zero Health Telemetry:** Blood pressure readings, blood glucose metrics, prescription schedules, doctor appointments, and personal health journal notes are never broadcasted to analytics or advertising networks.
- **Emergency ICE Card Security:** The emergency medical wallet card data is processed locally and formatted using `@media print` without sending any personal data to remote print servers.

### Travel, Navigation & Trip Planning Utilities
All 55 Travel, Navigation & Planning utilities operate purely client-side without external tracking or tracking pixels:
- **No Geolocation Snooping / Real-Time Tracking:** We do not track your real-time physical location, continuous GPS movements, or background route habits. Coordinate conversions, bearing calculations, and compass direction algorithms run offline via pure spherical trigonometry and Haversine equations.
- **Offline Coordinate Conversion & Geodesy:** Decimal Degrees <-> DMS conversions, GPS formatting (DD, DMS, DDM, RFC 5870 GeoURI), and great-circle distances are computed in-memory without contacting external mapping APIs.
- **Deep Map Links Without Tracking:** Map links and route links for Google Maps, Apple Maps, OpenStreetMap, and Bing Maps are formatted as standard client-side URLs without transmitting your itinerary or route parameters to third-party ad networks.
- **Transparent Benchmark Currencies:** Currency conversions use offline reference benchmark rates with full manual override capabilities, ensuring complete privacy and transparent exchange rate computations without calling third-party financial tracking endpoints.
- **Confidential Travel Documents:** Passport reminders, visa expiry dates, flight records, and hotel bookings remain stored in local IndexedDB (`lifetools_travel_db`) and are never inspected or synced.

### Home, Household & Property Utilities
All 70 Home, Household & Property utilities operate strictly within client browser memory and local IndexedDB (`lifetools_household_db`):
- **Utility & Energy Data Privacy:** Electricity, water, LPG, and internet consumption estimates are computed locally. No utility account numbers, consumer IDs, or smart meter telemetry are queried or uploaded.
- **Civil & Construction Estimates:** Concrete, cement, mortar, brickwork, and staircase calculations are performed offline without transmitting project architectural blueprints or engineering plans. Calculations are informative estimations and do not constitute certified structural engineering advice.
- **Confidential Real Estate & Financial Records:** Property values, rental yields, mortgage PITI splits, loan affordability debt amounts, and repair expenses remain private in your browser. No deeds, titles, or property tax IDs are ever transmitted to lenders or cloud brokers.
- **Regional Land Metrology:** Land area conversions (including regional Marla and Kanal standards) run offline with zero server dependencies.

---

## 🌍 5. Regulatory Compliance

Because LifeTools does not collect, process, or sell Personally Identifiable Information (PII):
- **GDPR (EU):** Full compliance without requiring invasive cookie banners.
- **CCPA (California):** No consumer personal information is collected or sold.
- **COPPA:** Safe for all ages; no data is gathered from minors or any user.

---

## 📬 Contact

For questions regarding LifeTools privacy principles, contact:
- **Developer:** Hazim Bashir (حازم بشیر)
- **Official Email:** [hazimbashir.dev@gmail.com](mailto:hazimbashir.dev@gmail.com)
- **GitHub:** [@officialhazim42](https://github.com/officialhazim42)
