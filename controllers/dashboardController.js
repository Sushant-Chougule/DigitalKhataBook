const db = require('../database/db');

exports.getIndex = (req, res) => {
    const totalCustomers = db.prepare('SELECT COUNT(*) as count FROM customers').get().count;
    const totalBusinesses = db.prepare('SELECT COUNT(*) as count FROM businesses').get().count;
    const todayTransactions = db.prepare("SELECT COUNT(*) as count FROM transactions WHERE date >= date('now')").get().count;
    
    const ownerPayable = db.prepare('SELECT SUM(balance) as total FROM customers WHERE balance > 0').get().total || 0;
    const ownerReceivable = db.prepare('SELECT ABS(SUM(balance)) as total FROM customers WHERE balance < 0').get().total || 0;

    const recentTransactions = db.prepare(`
        SELECT t.*, c.full_name as customer_name, b.name as business_name
        FROM transactions t
        JOIN customers c ON t.customer_id = c.id
        LEFT JOIN businesses b ON t.business_id = b.id
        ORDER BY t.date DESC LIMIT 10
    `).all();

    const topCustomers = db.prepare('SELECT * FROM customers ORDER BY ABS(balance) DESC LIMIT 5').all();

    // Data for Business-wise Revenue (Chart)
    const businessStats = db.prepare(`
        SELECT b.name, SUM(ABS(t.amount)) as total
        FROM transactions t
        JOIN businesses b ON t.business_id = b.id
        GROUP BY b.id
    `).all();

    res.render('pages/dashboard', {
        title: 'Dashboard',
        stats: {
            totalCustomers,
            totalBusinesses,
            todayTransactions,
            ownerPayable,
            ownerReceivable
        },
        recentTransactions,
        topCustomers,
        businessStats
    });
};
