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
        const businesses = db.prepare("SELECT id, name FROM businesses WHERE status = 'Active' ORDER BY name ASC").all();

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
        const businesses = db.prepare("SELECT id, name FROM businesses WHERE status = 'Active' ORDER BY name ASC").all();
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

exports.add = (req, res) => {
    const { customer_id, business_id, type, amount, remarks, date } = req.body;
    
    // Improved timestamp logic: Use selected date + current time
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
        const bizId = business_id ? parseInt(business_id) : null;

        if (isNaN(amt) || isNaN(custId)) {
            return res.redirect('/transactions/add?error=Invalid data');
        }

        db.prepare(`
            INSERT INTO transactions (customer_id, business_id, type, amount, remarks, date)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(custId, bizId, type, amt, remarks, transDate);

        updateCustomerBalance(custId);

        if (req.body.redirect_to === 'profile') {
            res.redirect(`/customers/${custId}?success=success_trans_add`);
        } else {
            res.redirect('/transactions/add?success=success_trans_add');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/transactions/add?error=Failed to add transaction');
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

    let balance = 0;
    transactions.forEach(t => {
        if (['milk_collection', 'owner_payment', 'customer_payment'].includes(t.type)) {
            balance += t.amount;
        } else {
            balance -= t.amount;
        }
    });

    db.prepare('UPDATE customers SET balance = ? WHERE id = ?').run(balance, customerId);
}
