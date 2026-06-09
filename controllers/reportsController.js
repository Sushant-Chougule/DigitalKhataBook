const db = require('../database/db');

exports.getIndex = (req, res) => {
    const businesses = db.prepare('SELECT * FROM businesses').all();
    res.render('pages/reports', { title: 'Reports', businesses, results: null });
};

exports.generateReport = (req, res) => {
    const { report_type, business_id, start_date, end_date } = req.body;
    let results = [];
    let query = '';
    let params = [];

    if (report_type === 'transaction') {
        query = `
            SELECT t.*, c.full_name as customer_name, b.name as business_name 
            FROM transactions t
            JOIN customers c ON t.customer_id = c.id
            LEFT JOIN businesses b ON t.business_id = b.id
            WHERE t.date BETWEEN ? AND ?
        `;
        params = [start_date + ' 00:00:00', end_date + ' 23:59:59'];
        if (business_id) {
            query += ' AND t.business_id = ?';
            params.push(business_id);
        }
        query += ' ORDER BY t.date DESC';
        results = db.prepare(query).all(...params);
    } else if (report_type === 'balance') {
        results = db.prepare('SELECT * FROM customers ORDER BY balance DESC').all();
    }

    const businesses = db.prepare('SELECT * FROM businesses').all();
    res.render('pages/reports', { 
        title: 'Reports', 
        businesses, 
        results, 
        report_type,
        start_date,
        end_date
    });
};
