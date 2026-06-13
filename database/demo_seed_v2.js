const db = require('./db');

// --- Helper Data ---
const firstNames = ["Arjun", "Deepak", "Sanjay", "Rajesh", "Amit", "Vikram", "Sunil", "Prakash", "Manoj", "Vijay", "Priyanka", "Anjali", "Kavita", "Meena", "Sunita", "Neeta", "Ramesh", "Suresh", "Ganesh", "Mahesh", "Rahul", "Rohit", "Sameer", "Abhishek", "Karan", "Pooja", "Aarti", "Sneha", "Jyoti", "Lata"];
const lastNames = ["Sharma", "Verma", "Patel", "Singh", "Yadav", "Gupta", "Mishra", "Patil", "Deshmukh", "Kulkarni", "Joshi", "Choudhary", "Jain", "Agrawal", "Trivedi"];
const cities = ["Raipur", "Bhilai", "Durg", "Nagpur", "Patan", "Pune", "Mumbai", "Indore", "Bhopal", "Surat"];

const businessMapping = {
    'milk_collection': 1,     // Dairy Farm
    'grocery_purchase': 2,    // Grocery Shop
    'medical_purchase': 3,    // Medical Store
    'hospital_expense': 4,    // Hospital
    'borrowing': 5,           // Cash
    'owner_payment': 5,       // Cash
    'customer_payment': 5     // Cash
};

const types = Object.keys(businessMapping);
const remarks_list = ["Monthly bill", "Weekly supply", "Emergency", "Regular purchase", "Cash paid", "Partial payment", "Full settlement"];

function seed() {
    console.log("Starting Demo Data Seeding (V2 with Mapping Rules)...");

    try {
        // 1. Clean up existing data first
        db.prepare('DELETE FROM transactions').run();
        db.prepare('DELETE FROM customers').run();
        db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('transactions', 'customers')").run();
        console.log("Old data cleaned.");

        // 2. Add 50 Customers
        const insertCust = db.prepare('INSERT INTO customers (customer_code, full_name, mobile, address, village_city) VALUES (?, ?, ?, ?, ?)');
        for (let i = 1; i <= 50; i++) {
            const name = firstNames[Math.floor(Math.random() * firstNames.length)] + " " + lastNames[Math.floor(Math.random() * lastNames.length)];
            const mobile = "9" + Math.floor(100000000 + Math.random() * 900000000).toString();
            const city = cities[Math.floor(Math.random() * cities.length)];
            const code = 'CUS' + i.toString().padStart(4, '0');
            const address = `House No ${i}, Street ${Math.floor(Math.random() * 20) + 1}, ${city}`;
            insertCust.run(code, name, mobile, address, city);
        }
        const customers = db.prepare('SELECT id FROM customers').all();
        console.log("50 Customers added.");

        // 3. Add 200 Transactions following strict rules
        const insertTrans = db.prepare('INSERT INTO transactions (customer_id, business_id, type, amount, remarks, date) VALUES (?, ?, ?, ?, ?, ?)');
        for (let i = 0; i < 200; i++) {
            const cust = customers[Math.floor(Math.random() * customers.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            const bizId = businessMapping[type];
            const amount = Math.floor(Math.random() * 4500) + 50;
            const remarks = remarks_list[Math.floor(Math.random() * remarks_list.length)];
            
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));
            date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

            insertTrans.run(cust.id, bizId, type, amount, remarks, date.toISOString());
        }
        console.log("200 Transactions added (following business rules).");

        // 4. Update Balances
        console.log("Updating customer balances...");
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
    } catch (err) {
        console.error("Seeding failed:", err.message);
    }
}

seed();
