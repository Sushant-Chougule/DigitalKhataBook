const db = require('../database/db');

exports.getAll = (req, res) => {
    const customers = db.prepare('SELECT * FROM customers ORDER BY full_name ASC').all();
    res.render('pages/customers', { title: 'Customers', customers, error: req.query.error || null, success: req.query.success || null });
};

exports.getProfile = (req, res) => {
    const id = req.params.id;
    const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);

    if (!customer) return res.redirect('/customers');

    const transactions = db.prepare(`
        SELECT t.*, b.name as business_name
        FROM transactions t
        LEFT JOIN businesses b ON t.business_id = b.id
        WHERE t.customer_id = ?
        ORDER BY t.date ASC, t.id ASC
    `).all(id);

    let runningBalance = 0;
    const transactionsWithBalance = transactions.map(t => {
        if (['milk_collection', 'owner_payment', 'customer_payment'].includes(t.type)) {
            runningBalance += t.amount;
        } else {
            runningBalance -= t.amount;
        }
        return { ...t, runningBalance };
    });

    transactionsWithBalance.reverse();

    const businessSummary = db.prepare(`
        SELECT b.name as business_name,
               SUM(CASE
                   WHEN t.type IN ('milk_collection', 'owner_payment', 'customer_payment') THEN t.amount
                   ELSE -t.amount END) as net_amount
        FROM transactions t
        LEFT JOIN businesses b ON t.business_id = b.id
        WHERE t.customer_id = ?
        GROUP BY b.id
    `).all(id);

    res.render('pages/customer-profile', {
        title: 'Customer Profile',
        customer,
        transactions: transactionsWithBalance,
        businessSummary,
        error: req.query.error || null,
        success: req.query.success || null
    });
};

exports.add = (req, res) => {
    const { full_name, mobile, address, village_city, notes } = req.body;

    if (!mobile || mobile.length !== 10 || isNaN(mobile)) {
        return res.redirect('/customers?error=err_mobile_10');
    }

    try {
        const countRes = db.prepare("SELECT COUNT(*) as total FROM customers").get();
        const nextNum = (countRes ? countRes.total : 0) + 1;
        let code = 'CUS' + nextNum.toString().padStart(4, '0');
        
        while (db.prepare('SELECT id FROM customers WHERE customer_code = ?').get(code)) {
            code = 'CUS' + (Math.floor(Math.random() * 10000)).toString().padStart(4, '0');
        }

        db.prepare('INSERT INTO customers (customer_code, full_name, mobile, address, village_city, notes) VALUES (?, ?, ?, ?, ?, ?)').run(
            code, full_name, mobile, address, village_city, notes
        );
        res.redirect('/customers?success=success_add');
    } catch (err) {
        console.error(err);
        res.redirect('/customers?error=err_add_failed');
    }
};

exports.edit = (req, res) => {
    const id = req.params.id;
    const { full_name, mobile, address, village_city, notes, customer_code } = req.body;

    if (!mobile || mobile.length !== 10 || isNaN(mobile)) {
        return res.redirect(`/customers/${id}?error=err_mobile_10`);
    }

    try {
        const result = db.prepare('UPDATE customers SET full_name = ?, mobile = ?, address = ?, village_city = ?, notes = ?, customer_code = ? WHERE id = ?').run(
            full_name, mobile, address, village_city, notes, customer_code, id
        );
        
        if (result.changes > 0) {
            res.redirect(`/customers/${id}?success=success_update`);
        } else {
            res.redirect(`/customers/${id}?error=err_no_changes`);
        }
    } catch (err) {
        console.error(err);
        res.redirect(`/customers/${id}?error=err_update_failed`);
    }
};

exports.delete = (req, res) => {
    const id = req.params.id;
    db.prepare('DELETE FROM transactions WHERE customer_id = ?').run(id);
    db.prepare('DELETE FROM customers WHERE id = ?').run(id);
    res.redirect('/customers?success=success_delete');
};

exports.apiGetCustomer = (req, res) => {
    const search = req.params.query;
    const customer = db.prepare('SELECT * FROM customers WHERE customer_code = ? OR mobile = ?').get(search, search);
    
    if (customer) {
        const businessSummary = db.prepare(`
            SELECT b.name as business_name,
                   SUM(CASE
                       WHEN t.type IN ('milk_collection', 'owner_payment', 'customer_payment') THEN t.amount
                       ELSE -t.amount END) as net_amount
            FROM transactions t
            LEFT JOIN businesses b ON t.business_id = b.id
            WHERE t.customer_id = ?
            GROUP BY b.id
        `).all(customer.id);

        const lastTransactions = db.prepare(`
            SELECT t.*, b.name as business_name
            FROM transactions t
            LEFT JOIN businesses b ON t.business_id = b.id
            WHERE t.customer_id = ?
            ORDER BY t.date DESC, t.id ASC
            LIMIT 10
        `).all(customer.id);

        res.json({ success: true, customer, businessSummary, lastTransactions });
    } else {
        res.json({ success: false, message: 'Customer not found' });
    }
};

exports.apiSearchCustomers = (req, res) => {
    const q = req.query.q;
    const term = `%${q}%`;
    const customers = db.prepare('SELECT id, full_name, customer_code, mobile FROM customers WHERE full_name LIKE ? OR customer_code LIKE ? OR mobile LIKE ? LIMIT 10').all(term, term, term);
    res.json(customers);
};
