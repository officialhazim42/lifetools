# LifeTools — Universal Backup & Restore System Guide

## 1. Overview & Architecture

The **LifeTools Universal Backup & Restore System** provides users with complete, self-sovereign custody over all their application data, notes, tasks, financial ledgers, habit streaks, preferences, and custom utility states.

In strict alignment with the LifeTools zero-knowledge architecture:
- **100% Client-Side:** All data collection, compression, encryption, validation, and restoration occur entirely within the user's browser runtime.
- **Zero Server Uploads:** No data, keys, credentials, or hashes are ever transmitted across the network.
- **Offline Capable:** Full functionality remains intact whether connected to the internet or running completely offline as a Progressive Web App (PWA).

---

## 2. Supported Data Structures & Scope

The Universal Backup engine inspects and gathers data across both **IndexedDB** (`lifetools_workspace_db`) and **LocalStorage**:

| Entity / Scope | Storage Technology | Payload Data Included |
| :--- | :--- | :--- |
| **My Notes** | IndexedDB (`notes`) | ID, Title, Rich Content, Category, Pinned Status, Timestamps, Color |
| **My Tasks** | IndexedDB (`tasks`) | ID, Title, Description, Priority, Due Date, Completed Status, Category |
| **My Expenses** | IndexedDB (`expenses`) | ID, Title, Amount, Currency (INR default), Category, Payment Method, Date, Notes |
| **My Habits** | IndexedDB (`habits`) | ID, Title, Frequency, Target Days, Streaks, Completed Date Log |
| **My Goals** | IndexedDB (`goals`) | ID, Title, Category, Target Date, Milestones, Progress Percentage |
| **Calendar Events**| IndexedDB (`events`) | ID, Title, Date, Start/End Time, Category, Reminder Flag |
| **Favorites** | LocalStorage | Starred / bookmarked tools array (`lifetools-favorites`) |
| **Recently Used** | LocalStorage | Tool access timestamps and history (`lifetools-recent`) |
| **App Settings** | LocalStorage | Theme, Typography, Layout Density, Regional Currency & Date Formats (`lifetools-settings-v1`) |
| **Tool Storage** | LocalStorage | Tool-specific datasets (Timetables, Flashcards, Grocery Lists, Calculators) |

---

## 3. Supported Export Formats

LifeTools provides four versatile export formats tailored for data preservation, external migration, and spreadsheet analysis:

### A. Universal JSON Archive (`.json`)
- **Specification:** RFC 8259 Standard JSON with a standardized manifest header.
- **Manifest:** Includes `appName`, `version`, `schemaVersion`, `exportedAt`, `totalRecords`, `categoryCounts`, and a cryptographic SHA-256 integrity checksum.
- **Best For:** Complete system backups, quick migration between browsers or devices, and automated programmatic ingestion.

### B. All-in-One ZIP Package (`.zip`)
- **Specification:** Standard PKWARE (APPNOTE.TXT) ZIP archive format generated using a 100% pure TypeScript zero-dependency binary engine.
- **Contents:**
  - `lifetools_data.json` — Master JSON archive.
  - `expenses.csv` — Transaction history spreadsheet.
  - `tasks.csv` — Task and to-do list spreadsheet.
  - `notes.csv` — Notes and memos spreadsheet.
  - `habits.csv` — Habit tracking and streak history spreadsheet.
  - `lifetools_summary.txt` — Human-readable plain text documentation.
  - `README.txt` — Archive metadata and restoration instructions.
- **Compatibility:** Natively openable on Windows Explorer, macOS Archive Utility, Linux, Android Files, and 7-Zip without third-party software.

### C. Tabular CSV Spreadsheets (`.csv`)
- **Specification:** RFC 4180 compliant Comma-Separated Values with proper character escaping.
- **Dedicated Exporters:**
  - `lifetools_expenses_YYYY-MM-DD.csv`
  - `lifetools_tasks_YYYY-MM-DD.csv`
  - `lifetools_notes_YYYY-MM-DD.csv`
  - `lifetools_habits_YYYY-MM-DD.csv`
- **Compatibility:** Microsoft Excel, Google Sheets, Apple Numbers, LibreOffice Calc, Notion, and Obsidian.

### D. Human-Readable Plain Text (`.txt`)
- **Specification:** Clean markdown-formatted text document.
- **Best For:** Archiving in offline notes, personal journaling, printing, or reading in any lightweight text editor (Notepad, TextEdit, VS Code).

---

## 4. Cryptographic Security & Password Protection

For sensitive personal notes, passwords, or financial logs, LifeTools includes native **AES-256-GCM** encryption powered by the modern W3C **Web Crypto API**:

```
[User Password] ──> [PBKDF2 (100,000 iterations, SHA-256, 16-byte random salt)]
                             │
                             ▼
                    [256-bit AES-GCM Key]
                             │
[Data Payload] + [12-byte IV] ──> [AES-GCM Ciphertext + Auth Tag]
```

### Technical Parameters:
- **Cipher:** AES-GCM (Galois/Counter Mode) with 256-bit key length and 128-bit authentication tag.
- **Key Derivation Function (KDF):** PBKDF2 with HMAC-SHA-256 and **100,000 iterations** to prevent brute-force and dictionary attacks.
- **Salt & IV:** Cryptographically secure pseudo-random bytes generated via `crypto.getRandomValues()` (16-byte salt, 12-byte IV per backup).
- **Integrity Validation:** SHA-256 payload hash computed before encryption and verified post-decryption.

> [!CAUTION]
> **Password Recovery Notice:** Because encryption is executed entirely on the client side without central servers or master keys, **a forgotten password cannot be recovered or reset by anyone**. Always store your backup password securely.

---

## 5. Restoration Engine & Conflict Resolution

LifeTools features a multi-stage pre-restore inspection and safety pipeline:

### Stage 1: Validation & Integrity Check
1. The uploaded `.json` or `.zip` file is inspected in memory.
2. If encrypted, the user is prompted for the decryption password.
3. The cryptographic SHA-256 checksum is compared against the payload.
4. Schema version compatibility is verified.
5. Record count discrepancies or structural issues are reported as warnings or errors.

### Stage 2: Restoration Modes

Users can choose from three distinct restoration strategies:

#### 1. Merge Mode (Recommended)
- Appends all incoming records to existing local databases.
- If an incoming entity shares an identical ID with an existing record, the incoming entity is automatically assigned a unique suffix (`${id}_restored_${timestamp}`).
- **Zero data loss:** Both existing user notes and incoming backup notes are preserved.

#### 2. Replace Mode (Destructive)
- Clears selected local collections and replaces them entirely with data from the backup archive.
- Requires explicit user confirmation checkbox before execution to avoid accidental erasure.

#### 3. Selective Mode
- Allows users to selectively restore only specific categories (e.g., restore only "My Expenses" and "My Notes", while preserving existing "My Tasks" and "Settings").

---

## 6. Backup History & Automated Reminders

- **Local History Log:** Automatically logs backup timestamps, formats, byte sizes, categories, and encryption status in `localStorage` (`lifetools-backup-history`).
- **Configurable Reminder Schedules:**
  - **Weekly:** Prompts every 7 days (ideal for active daily tracking).
  - **Monthly:** Prompts every 30 days.
  - **Manual Only:** Disables background prompts for on-demand backups.
- **Visual Status Banners:** Subtle indicators in the Backup & Restore Center alert users when a scheduled backup is overdue.

---

## 7. Zero-Knowledge Privacy Manifesto

1. **No External Storage:** LifeTools never stores or synchronizes user data to external cloud servers, databases, or third-party telemetry systems.
2. **Offline-First:** All backup, ZIP generation, and decryption operations function in an air-gapped environment without active internet connectivity.
3. **Open Standards:** All exported data is formatted in standard, transparent formats (JSON, ZIP, CSV, TXT) to prevent vendor lock-in.
