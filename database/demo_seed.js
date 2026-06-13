const db = require('./db');

// --- Helper Data ---
const firstNames = ["Arjun", "Deepak", "Sanjay", "Rajesh", "Amit", "Vikram", "Sunil", "Prakash", "Manoj", "Vijay", "Priyanka", "Anjali", "Kavita", "Meena", "Sunita", "Neeta", "Ramesh", "Suresh", "Ganesh", "Mahesh", "Rahul", "Rohit", "Sameer", "Abhishek", "Karan", "Pooja", "Aarti", "Sneha", "Jyoti", "Lata"];
const lastNames = ["Sharma", "Verma", "Patel", "Singh", "Yadav", "Gupta", "Mishra", "Patil", "Deshmukh", "Kulkarni", "Joshi", "Choudhary", "Jain", "Agrawal", "Trivedi"];
const cities = ["Raipur", "Bhilai", "Durg", "Nagpur", "Patan", "Pune", "Mumbai", "Indore", "Bhopal", "Surat"];
const types = ['milk_collection', 'grocery_purchase', 'medical_purchase', 'hospital_expense', 'borrowing', 'owner_payment', 'customer_payment'];
const remarks_list = ["Monthly bill", "Weekly supply", "Emergency", "Regular purchase", "Cash paid", "Partial payment", "Full settlement"];

// --- Logic ---

function seed() {
    console.log("Starting Demo Data Seeding...");

    // 1. Ensure we have at least 4 businesses
    const bizCount = db.prepare('SELECT COUNT(*) as count FROM businesses').get().count;
    if (bizCount < 4) {
        console.log("Adding default businesses...");
        const insertBiz = db.prepare('INSERT INTO businesses (name, type, status) VALUES (?, ?, ?)');
        const defaults = [
            ['Dairy Farm', 'Dairy Farm', 'Active'],
            ['Grocery Shop', 'Grocery Shop', 'Active'],
            ['Medical Store', 'Medical Store', 'Active'],
            ['General Hospital', 'Hospital', 'Active']
        ];
        defaults.forEach(b => insertBiz.run(b[0], b[1], b[2]));
    }
    const businesses = db.prepare('SELECT id FROM businesses').all();

    // 2. Add 50 Customers if count is low
    const currentCustCount = db.prepare('SELECT COUNT(*) as count FROM customers').get().count;
    if (currentCustCount < 50) {
        console.log(`Current customer count is ${currentCustCount}. Adding more to reach 50...`);
        const insertCust = db.prepare('INSERT INTO customers (customer_code, full_name, mobile, address, village_city) VALUES (?, ?, ?, ?, ?)');
        
        for (let i = currentCustCount + 1; i <= 55; i++) {
            const name = firstNames[Math.floor(Math.random() * firstNames.length)] + " " + lastNames[Math.floor(Math.random() * lastNames.length)];
            const mobile = "9" + Math.floor(100000000 + Math.random() * 900000000).toString();
            const city = cities[Math.floor(Math.random() * cities.length)];
            const code = 'CUS' + i.toString().padStart(4, '0');
            const address = `House No ${i}, Street ${Math.floor(Math.random() * 20) + 1}, ${city}`;
            
            try {
                insertCust.run(code, name, mobile, address, city);
            } catch (e) {
                // Skip if unique constraint fails
            }
        }
    }
    const customers = db.prepare('SELECT id FROM customers').all();

    // 3. Add 200 Transactions
    const currentTransCount = db.prepare('SELECT COUNT(*) as count FROM transactions').get().count;
    if (currentTransCount < 200) {
        console.log(`Current transaction count is ${currentTransCount}. Adding more to reach 200...`);
        const insertTrans = db.prepare('INSERT INTO transactions (customer_id, business_id, type, amount, remarks, date) VALUES (?, ?, ?, ?, ?, ?)');
        
        for (let i = 0; i < 200; i++) {
            const cust = customers[Math.floor(Math.random() * customers.length)];
            const biz = businesses[Math.floor(Math.random() * businesses.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            const amount = Math.floor(Math.random() * 4500) + 50; // 50 to 5000
            const remarks = remarks_list[Math.floor(Math.random() * remarks_list.length)];
            
            // Random date in the last 30 days
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

            insertTrans.run(cust.id, biz.id, type, amount, remarks, date.toISOString());
        }
    }

    // 4. Update all Customer Balances
    console.log("Recalculating all customer balances...");
    customers.forEach(c => {
        const trans = db.prepare('SELECT type, amount FROM transactions WHERE customer_id = ?').all(c.id);
        let balance = 0;
        trans.forEach(t => {
            if (['milk_collection', 'owner_payment', 'customer_payment'].includes(t.type)) {
                balance += t.amount;
            } else {
                balance -= t.amount;
            }
        });
        db.prepare('UPDATE customers SET balance = ? WHERE id = ?').run(balance, c.id);
    });

    console.log("Demo data seeding completed successfully!");
}

seed();
