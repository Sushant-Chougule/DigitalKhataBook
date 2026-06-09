const db = require('./db');

try {
    // Add column if not exists
    const tableInfo = db.prepare("PRAGMA table_info(customers)").all();
    const columnExists = tableInfo.some(col => col.name === 'customer_code');
    
    if (!columnExists) {
        db.prepare("ALTER TABLE customers ADD COLUMN customer_code TEXT").run();
        console.log('Column customer_code added to customers table');
    }

    // Generate codes for customers who don't have one
    const customers = db.prepare("SELECT id FROM customers WHERE customer_code IS NULL OR customer_code = ''").all();
    
    const updateCode = db.prepare("UPDATE customers SET customer_code = ? WHERE id = ?");
    
    customers.forEach((c) => {
        // Count how many have codes to determine next number
        const countRes = db.prepare("SELECT COUNT(*) as total FROM customers WHERE customer_code IS NOT NULL AND customer_code != ''").get();
        const nextNum = (countRes ? countRes.total : 0) + 1;
        let code = 'CUS' + nextNum.toString().padStart(4, '0');
        
        // Ensure uniqueness loop
        let attempts = 0;
        while (db.prepare("SELECT id FROM customers WHERE customer_code = ?").get(code)) {
            attempts++;
            code = 'CUS' + (nextNum + attempts).toString().padStart(4, '0');
        }

        updateCode.run(code, c.id);
        console.log(`Generated code ${code} for customer ID ${c.id}`);
    });

    console.log('Migration completed successfully');

} catch (err) {
    console.error('Migration failed:', err.message);
}
