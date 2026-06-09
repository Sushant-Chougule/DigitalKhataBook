# DigitalKhataBook

A complete full-stack web application for small business owners to manage multiple businesses and shared customers, automatically calculating net balances.

## Features
- **MVC Architecture**: Clean and organized code structure.
- **Multi-Business Support**: Manage multiple businesses (Dairy, Grocery, Medical, etc.) in one place.
- **Shared Customers**: Customers are common across all businesses.
- **Automatic Balance Engine**: Real-time calculation of net balance (Positive = Owner owes customer, Negative = Customer owes owner).
- **Modern UI**: Responsive dashboard with Bootstrap 5 and Dark/Light mode.
- **Detailed Ledger**: Individual customer profiles with complete transaction history.
- **Session Authentication**: Secure login for admin.

## Technology Stack
- **Backend**: Node.js, Express.js
- **Database**: SQLite (better-sqlite3)
- **Frontend**: EJS, Bootstrap 5, Chart.js
- **Auth**: express-session, bcryptjs

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Check `.env` file for PORT and Admin credentials.
   Default: admin / admin123

3. **Run Application**:
   ```bash
   npm start
   ```

4. **Access**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Business Logic
- **Milk Collection**: Increases Customer Credit (Owner owes money).
- **Owner Payment**: Increases Customer Credit (Owner pays customer).
- **Grocery/Medical/Hospital/Borrowing**: Decreases Customer Credit (Customer owes money).
- **Customer Payment**: Reduces Customer Debt (Increases balance).

## Project Structure
- `controllers/`: Request handling logic.
- `database/`: DB connection and setup scripts.
- `middleware/`: Authentication checks.
- `public/`: Static assets (CSS, JS).
- `routes/`: Express route definitions.
- `views/`: EJS templates for the UI.
