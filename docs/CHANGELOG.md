# Change Log - DigitalKhataBook

## [2026-06-08] - Current State
### Added
- **Project Structure**: Created MVC-based web application with Node.js and SQLite.
- **Auth**: Session-based login/logout for admin.
- **Customer Module**: 
  - Added unique `customer_code` auto-generation.
  - Implemented 10-digit mobile number validation.
  - Fix: Fixed customer info updates not reflecting in the database.
- **Transaction Module**:
  - NEW: Centralized "Add Transaction" page with customer autocomplete.
  - Logic: Implemented net balance calculation formula.
  - Logic: Added running balance to customer ledger.
  - Fix: Corrected SQLite string quoting errors ("Active").
- **UI/UX**:
  - Dashboard with stat cards and Chart.js visualizations.
  - Improved Dark Mode support for better text visibility.
  - Excel/CSV export for ledgers and reports.
- **Multilingual Support**:
  - English and Marathi support with session-based switching.
  - Indian Date/Time formatting (`DD-MM-YYYY HH:mm:ss`).
  - Automatic translation hooks for data rows.

### Files Modified
- `server.js`
- `controllers/` (All)
- `routes/` (All)
- `views/` (All)
- `public/css/style.css`
- `public/js/main.js`

### Testing Performed
- Manual login verification.
- Transaction save & balance preview accuracy checks.
- Mobile responsiveness testing across pages.
- Language persistency across refreshes.
