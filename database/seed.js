const db = require('./db');

const businessCount = db.prepare('SELECT COUNT(*) as count FROM businesses').get().count;

if (businessCount === 0) {
    const businesses = [
        ['Dairy Farm', 'Dairy Farm', 'Daily milk collection center'],
        ['Grocery Shop', 'Grocery Shop', 'General provision store'],
        ['Medical Store', 'Medical Store', 'Pharmacy and healthcare'],
        ['General Hospital', 'Hospital', 'Multi-specialty hospital']
    ];

    const insertBusiness = db.prepare('INSERT INTO businesses (name, type, description) VALUES (?, ?, ?)');
    for (const b of businesses) {
        insertBusiness.run(b[0], b[1], b[2]);
    }
    console.log('Businesses seeded');
}

const customerCount = db.prepare('SELECT COUNT(*) as count FROM customers').get().count;

if (customerCount === 0) {
    const customers = [
        ['Rahul Sharma', '9876543210', 'Street 1, Raipur', 'Raipur', 'Regular milk supplier'],
        ['Anita Patil', '9876543211', 'Main Road, Bhilai', 'Bhai', 'Grocery regular'],
        ['Suresh Kumar', '9876543212', 'Sector 5, Durg', 'Durg', 'Borrowing often'],
        ['Meena Singh', '9876543213', 'Village Patan', 'Patan', 'Dairy and Medical'],
        ['Vijay Verma', '9876543214', 'City Center, Raipur', 'Raipur', 'All services']
    ];

    const insertCustomer = db.prepare('INSERT INTO customers (full_name, mobile, address, village_city, notes) VALUES (?, ?, ?, ?, ?)');
    for (const c of customers) {
        insertCustomer.run(c[0], c[1], c[2], c[3], c[4]);
    }
    console.log('Customers seeded');

    // Add some initial transactions to test balance calculation
    // Transaction Types: milk_collection, grocery_purchase, medical_purchase, hospital_expense, borrowing, owner_payment, customer_payment
    
    // Rahul (Customer 1) gives milk (Owner owes money -> positive balance)
    db.prepare("INSERT INTO transactions (customer_id, business_id, type, amount, remarks) VALUES (1, 1, 'milk_collection', 500, '10 Liters')").run();
    
    // Rahul buys grocery (Customer owes money -> negative impact on balance)
    db.prepare("INSERT INTO transactions (customer_id, business_id, type, amount, remarks) VALUES (1, 2, 'grocery_purchase', 200, 'Rice and Daal')").run();
    
    // Initial balance update logic for seeded transactions
    const cust1Balance = 500 - 200; // 300
    db.prepare('UPDATE customers SET balance = ? WHERE id = 1').run(cust1Balance);

    console.log('Sample transactions seeded and balances updated');
}
