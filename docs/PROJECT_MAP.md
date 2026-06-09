# Project Map - DigitalKhataBook

Mapping features to the codebase for easier navigation.

## 1. Authentication Module
- **Routes**: `routes/authRoutes.js`
- **Controller**: `controllers/authController.js`
- **Views**: `views/pages/login.ejs`
- **Middleware**: `middleware/authMiddleware.js`

## 2. Customer Module
- **Routes**: `routes/customerRoutes.js`
- **Controller**: `controllers/customerController.js`
- **Views**: 
  - `views/pages/customers.ejs` (List)
  - `views/pages/customer-profile.ejs` (Profile & Ledger)
- **API**: `/customers/api/search`, `/customers/api/:query`

## 3. Business Module
- **Routes**: `routes/businessRoutes.js`
- **Controller**: `controllers/businessController.js`
- **Views**: `views/pages/businesses.ejs`

## 4. Transaction Module
- **Routes**: `routes/transactionRoutes.js`
- **Controller**: `controllers/transactionController.js`
- **Views**: 
  - `views/pages/transactions.ejs` (All Transactions Ledger)
  - `views/pages/add-transaction.ejs` (Centralized Entry Page)

## 5. Dashboard & Analytics
- **Routes**: `routes/dashboardRoutes.js`
- **Controller**: `controllers/dashboardController.js`
- **Views**: `views/pages/dashboard.ejs`

## 6. Global Search
- **Routes**: `routes/searchRoutes.js`
- **Controller**: `controllers/searchController.js`
- **Views**: `views/pages/search.ejs`

## 7. Reports & Export
- **Routes**: `routes/reportsRoutes.js`
- **Controller**: `controllers/reportsController.js`
- **Views**: `views/pages/reports.ejs`
- **JS Helper**: `public/js/main.js` (`exportTableToCSV`)

## 8. Settings & Profile
- **Routes**: `routes/settingsRoutes.js`
- **Controller**: `controllers/settingsController.js`
- **Views**: `views/pages/settings.ejs`

## 9. Multilingual Support
- **Middleware**: `middleware/langMiddleware.js`
- **Locales**: `locales/en.json`, `locales/mr.json`
- **Layout Helper**: `views/layouts/main.ejs`
