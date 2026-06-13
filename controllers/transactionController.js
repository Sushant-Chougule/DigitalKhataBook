const db = require('../database/db');

exports.getAll = (req, res) => {
    try {
        const transactions = db.prepare(`
            SELECT t.*, c.full_name as customer_name, c.customer_code, b.name as business_name
            FROM transactions t
            JOIN customers c ON t.customer_id = c.id
            LEFT JOIN businesses b ON t.business_id = b.id
            ORDER BY t.date DESC
        `).all();

        const customers = db.prepare('SELECT id, full_name, customer_code FROM customers ORDER BY full_name ASC').all();
        const businesses = db.prepare("SELECT * FROM businesses WHERE status = 'Active' ORDER BY name ASC").all();

        res.render('pages/transactions', {
            title: 'Transactions',
            transactions,
            customers,
            businesses,
            error: req.query.error || null,
            success: req.query.success || null
        });
    } catch (err) {
        console.error(err);
        res.send('An error occurred while loading transactions.');
    }
};

exports.getAddTransaction = (req, res) => {
    try {
        const businesses = db.prepare("SELECT * FROM businesses WHERE status = 'Active' ORDER BY name ASC").all();
        res.render('pages/add-transaction', {
            title: 'Add Transaction',
            businesses,
            error: req.query.error || null,
            success: req.query.success || null
        });
    } catch (err) {
        console.error(err);
        res.send('Error loading transaction page.');
    }
};

exports.getEdit = (req, res) => {
    const id = req.params.id;
    try {
        const transaction = db.prepare("SELECT * FROM transactions WHERE id = ?").get(id);
        if (!transaction) return res.redirect('/transactions');

        const customer = db.prepare("SELECT full_name, customer_code FROM customers WHERE id = ?").get(transaction.customer_id);
        const businesses = db.prepare("SELECT * FROM businesses WHERE status = 'Active' ORDER BY name ASC").all();

        res.render('pages/edit-transaction', {
            title: 'Edit Transaction',
            transaction,
            customer,
            businesses,
            error: req.query.error || null
        });
    } catch (err) {
        console.error(err);
        res.redirect('/transactions');
    }
};

exports.postEdit = (req, res) => {
    const id = req.params.id;
    const { type, business_id, amount, remarks, date } = req.body;

    // Backend Validation & Enforcement
    let finalBusinessId = business_id ? parseInt(business_id) : null;
    
    // Check if type belongs to a specific business
    const mappingBiz = db.prepare("SELECT id FROM businesses WHERE transaction_type_name = ? AND name != 'Cash'").get(type);
    if (mappingBiz) {
        finalBusinessId = mappingBiz.id;
    } else if (['borrowing', 'settlement'].includes(type)) {
        // System types default to Cash if no business provided
        if (!finalBusinessId) {
            const cashBiz = db.prepare("SELECT id FROM businesses WHERE name = 'Cash'").get();
            if (cashBiz) finalBusinessId = cashBiz.id;
        }
    }

    try {
        const oldTrans = db.prepare("SELECT customer_id FROM transactions WHERE id = ?").get(id);

        db.prepare(`
            UPDATE transactions
            SET type = ?, business_id = ?, amount = ?, remarks = ?, date = ?
            WHERE id = ?
        `).run(type, finalBusinessId, parseFloat(amount), remarks, date, id);

        if (oldTrans) updateCustomerBalance(oldTrans.customer_id);

        res.redirect('/transactions?success=Transaction updated successfully');
    } catch (err) {
        console.error(err);
        res.redirect(`/transactions/edit/${id}?error=Update failed`);
    }
};

exports.add = (req, res) => {
    const { customer_id, business_id, type, amount, remarks, date } = req.body;

    // Backend Validation & Enforcement
    let finalBusinessId = business_id ? parseInt(business_id) : null;
    
    const mappingBiz = db.prepare("SELECT id FROM businesses WHERE transaction_type_name = ? AND name != 'Cash'").get(type);
    if (mappingBiz) {
        finalBusinessId = mappingBiz.id;
    } else if (['borrowing', 'settlement'].includes(type)) {
        if (!finalBusinessId) {
            const cashBiz = db.prepare("SELECT id FROM businesses WHERE name = 'Cash'").get();
            if (cashBiz) finalBusinessId = cashBiz.id;
        }
    }

    let transDate;
    const now = new Date();
    if (date) {
        const selectedDate = new Date(date);
        selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
        transDate = selectedDate.toISOString();
    } else {
        transDate = now.toISOString();
    }

    try {
        const amt = parseFloat(amount);
        const custId = parseInt(customer_id);

        if (isNaN(amt) || isNaN(custId)) {
            return res.redirect('/transactions/add?error=Invalid data');
        }

        db.prepare(`
            INSERT INTO transactions (customer_id, business_id, type, amount, remarks, date)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(custId, finalBusinessId, type, amt, remarks, transDate);

        updateCustomerBalance(custId);

        const successMsg = 'success_trans_add';
        if (req.body.redirect_to === 'profile') {
            res.redirect(`/customers/${custId}?success=${successMsg}`);
        } else {
            res.redirect(`/transactions/add?success=${successMsg}`);
        }
    } catch (err) {
        console.error(err);
        res.redirect('/transactions/add?error=Unable to save transaction');
    }
};

exports.delete = (req, res) => {
    const id = req.params.id;
    try {
        const trans = db.prepare('SELECT customer_id FROM transactions WHERE id = ?').get(id);

        if (trans) {
            db.prepare('DELETE FROM transactions WHERE id = ?').run(id);
            updateCustomerBalance(trans.customer_id);
        }
        res.redirect('/transactions?success=success_delete');
    } catch (err) {
        console.error(err);
        res.redirect('/transactions?error=Delete failed');
    }
};

function updateCustomerBalance(customerId) {
    const transactions = db.prepare('SELECT type, amount FROM transactions WHERE customer_id = ?').all(customerId);
    const businesses = db.prepare("SELECT transaction_type_name, balance_impact FROM businesses").all();
    
    const impactMap = {};
    businesses.forEach(b => {
        if (b.transaction_type_name && b.transaction_type_name !== 'mixed') {
            impactMap[b.transaction_type_name] = b.balance_impact;
        }
    });
    
    // Add system types
    impactMap['borrowing'] = 'Debit';
    impactMap['settlement'] = 'Credit';
    impactMap['owner_payment'] = 'Debit'; // Legacy compatibility
    impactMap['customer_payment'] = 'Credit'; // Legacy compatibility
    impactMap['milk_collection'] = 'Credit'; // Fallback

    let balance = 0;
    transactions.forEach(t => {
        const impact = impactMap[t.type];
        if (impact === 'Credit') {
            balance += t.amount;
        } else if (impact === 'Debit') {
            balance -= t.amount;
        } else {
            // Fallback for types not mapped
            if (['milk_collection', 'settlement', 'customer_payment'].includes(t.type)) {
                balance += t.amount;
            } else {
                balance -= t.amount;
            }
        }
    });

    db.prepare('UPDATE customers SET balance = ? WHERE id = ?').run(balance, customerId);
}
