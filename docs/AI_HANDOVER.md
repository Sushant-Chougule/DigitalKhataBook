# AI Handover Documentation - DigitalKhataBook

## Project Purpose
DigitalKhataBook is a full-stack web application designed for small business owners who manage multiple businesses with shared customers. It centralizes transaction recording and automatically calculates a "Net Balance" for each customer across all businesses.

## Architecture Overview
The project follows the **MVC (Model-View-Controller)** architectural pattern:
- **Model**: SQLite database schema and logic (handled via `better-sqlite3`).
- **View**: EJS (Embedded JavaScript) templates with Bootstrap 5 for the UI.
- **Controller**: Logic to process requests and interact with models.

## Technology Stack
- **Backend**: Node.js, Express.js
- **Database**: SQLite (via `better-sqlite3`)
- **Frontend**: EJS, HTML, CSS, JavaScript, Bootstrap 5
- **Authentication**: Session-based (`express-session`)
- **Multilingual**: Custom middleware using JSON locales.

## Folder Structure
```text
D:\DigitalKhataBook\
├── server.js               # Entry point
├── controllers\            # Request handling logic
├── database\               # Connection and setup scripts
├── docs\                   # Project documentation
├── locales\                # Translation JSON files (en.json, mr.json)
├── middleware\             # Auth and Language middleware
├── public\                 # Static assets (css, js)
├── routes\                 # Route definitions
├── views\                  # EJS templates
│   ├── layouts\            # Master layout (main.ejs)
│   └── pages\              # Page-specific templates
└── package.json            # Dependencies and scripts
```

## Database Design
- **users**: Admin credentials and profile.
- **businesses**: List of businesses (Dairy, Grocery, etc.).
- **customers**: Customer details and auto-generated `customer_code`.
- **transactions**: Every credit/debit record linked to a customer and business.

## Business Logic & Balance Calculation
**Net Balance Formula:**
`Balance = (Milk Collection + Owner Payments + Customer Payments) - (Purchases + Borrowings)`

- **Positive Balance (Green)**: Owner owes money to the customer.
- **Negative Balance (Red)**: Customer owes money to the owner.

## Transaction Flow
1. User selects/searches a customer on the "Add Transaction" page.
2. App fetches current balance and summary via API.
3. User selects transaction type (Impact is previewed).
4. Transaction is saved; `updateCustomerBalance` logic recalculates the total.

## Customer & Report Flow
- **Customer**: Managed via searchable lists and detailed profile pages with running balance ledgers.
- **Reports**: Filterable by date and business, exportable to CSV/Excel.
