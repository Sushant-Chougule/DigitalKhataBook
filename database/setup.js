const db = require('./db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Create Users Table
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

// Create Businesses Table
db.prepare(`
    CREATE TABLE IF NOT EXISTS businesses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'Active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

// Create Customers Table
db.prepare(`
    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        mobile TEXT UNIQUE NOT NULL,
        address TEXT,
        village_city TEXT,
        notes TEXT,
        balance REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

// Create Transactions Table
db.prepare(`
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATETIME DEFAULT CURRENT_TIMESTAMP,
        customer_id INTEGER NOT NULL,
        business_id INTEGER,
        type TEXT NOT NULL, -- milk_collection, grocery_purchase, medical_purchase, hospital_expense, borrowing, owner_payment, customer_payment
        amount REAL NOT NULL,
        remarks TEXT,
        FOREIGN KEY (customer_id) REFERENCES customers(id),
        FOREIGN KEY (business_id) REFERENCES businesses(id)
    )
`).run();

// Seed Admin User if not exists
const adminUser = process.env.ADMIN_USER || 'admin';
const adminPass = process.env.ADMIN_PASS || 'admin123';

const userExists = db.prepare('SELECT * FROM users WHERE username = ?').get(adminUser);

if (!userExists) {
    const hashedPassword = bcrypt.hashSync(adminPass, 10);
    db.prepare('INSERT INTO users (username, password, full_name) VALUES (?, ?, ?)').run(adminUser, hashedPassword, 'System Administrator');
    console.log('Admin user created successfully');
}

console.log('Database tables initialized successfully');

// Run seeding if empty
require('./seed');
